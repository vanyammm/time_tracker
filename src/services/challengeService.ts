import {db} from "../db";
import {eq, and, inArray, sql, lte, ne} from "drizzle-orm";
import {
  challenges,
  challengeParticipants,
  type Challenge,
  ChallengeParticipantDetails,
  users,
  GroupedChallenge,
} from "../../db/schema";

export interface ChallengeCreationData {
  type: "Regular" | "Streak" | "Race" | "Team";
  action: string;
  hoursAmount: number;
  daysAmount?: number;
  buyIn: number;
}

export async function createChallenge(
  challengeData: ChallengeCreationData,
  hostId: number,
) {
  if (!hostId) {
    throw new Error("Host ID is required to create a challenge.");
  }

  const newChallenge = await db.transaction(async (tx) => {
    const insertedChallenge = await tx
      .insert(challenges)
      .values({
        hostId,
        type: challengeData.type.toLowerCase() as
          | "regular"
          | "streak"
          | "race"
          | "team",
        action: challengeData.action,
        hoursAmount: challengeData.hoursAmount,
        daysAmount: challengeData.daysAmount,
        buyIn: challengeData.buyIn,
        startDate: new Date(),
        status: "active",
      })
      .returning()
      .get();

    if (!insertedChallenge) {
      tx.rollback();
      throw new Error("Failed to create challenge.");
    }

    await tx.insert(challengeParticipants).values({
      userId: hostId,
      challengeId: insertedChallenge.id,
      progress: 0,
    });

    return insertedChallenge;
  });

  return newChallenge;
}

export async function getChallengeById(id: number): Promise<Challenge | null> {
  const challenge = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, id))
    .get();

  return challenge ?? null;
}

export async function getChallengesByUserId(
  userId: number,
): Promise<Challenge[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch challenges.");
    return [];
  }

  const userChallenges = await db
    .select({
      id: challenges.id,
      hostId: challenges.hostId,
      type: challenges.type,
      status: challenges.status,
      action: challenges.action,
      hoursAmount: challenges.hoursAmount,
      daysAmount: challenges.daysAmount,
      buyIn: challenges.buyIn,
      startDate: challenges.startDate,
    })
    .from(challengeParticipants)
    .leftJoin(challenges, eq(challengeParticipants.challengeId, challenges.id))
    .where(eq(challengeParticipants.userId, userId))
    .all();

  return userChallenges.filter((c): c is Challenge => c !== undefined);
}

async function checkAndUpdateRaceChallenge(
  challengeId: number,
  updatedUserId: number,
  tx: any,
) {
  const challenge = await tx
    .select()
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .get();

  if (
    !challenge ||
    challenge.type !== "race" ||
    challenge.status !== "active"
  ) {
    return;
  }

  const winner = await tx
    .select()
    .from(challengeParticipants)
    .where(
      and(
        eq(challengeParticipants.challengeId, challengeId),
        eq(challengeParticipants.userId, updatedUserId),
      ),
    )
    .get();

  const winnerHoursProgress = (winner?.progress ?? 0) / 3600;
  if (winnerHoursProgress >= challenge.hoursAmount) {
    await tx
      .update(challenges)
      .set({status: "finished"})
      .where(eq(challenges.id, challengeId));

    await tx
      .update(challengeParticipants)
      .set({status: "completed"})
      .where(
        and(
          eq(challengeParticipants.challengeId, challengeId),
          eq(challengeParticipants.userId, updatedUserId),
        ),
      );

    await tx
      .update(challengeParticipants)
      .set({status: "failed"})
      .where(
        and(
          eq(challengeParticipants.challengeId, challengeId),
          ne(challengeParticipants.userId, updatedUserId),
        ),
      );
  }
}

export async function getParticipantsByChallengeId(
  challengeId: number,
): Promise<ChallengeParticipantDetails[]> {
  const participantsList = await db
    .select({
      userId: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
      progress: challengeParticipants.progress,
      status: challengeParticipants.status,
    })
    .from(challengeParticipants)
    .innerJoin(users, eq(challengeParticipants.userId, users.id))
    .where(eq(challengeParticipants.challengeId, challengeId))
    .all();

  return participantsList;
}

export async function getGroupedActiveChallenges(
  userId: number,
): Promise<GroupedChallenge[]> {
  const userChallenges = await db
    .select()
    .from(challenges)
    .innerJoin(
      challengeParticipants,
      eq(challenges.id, challengeParticipants.challengeId),
    )
    .where(
      and(
        eq(challengeParticipants.userId, userId),
        eq(challenges.status, "active"),
      ),
    )
    .all();

  if (userChallenges.length === 0) {
    return [];
  }

  const grouped = userChallenges.reduce((acc, {challenges: challenge}) => {
    if (acc[challenge.action]) {
      acc[challenge.action].challengeIds.push(challenge.id);
    } else {
      acc[challenge.action] = {
        action: challenge.action,
        challengeIds: [challenge.id],
      };
    }
    return acc;
  }, {} as Record<string, GroupedChallenge>);

  return Object.values(grouped);
}

export async function addProgressToChallenges(
  userId: number,
  challengeIds: number[],
  secondsToAdd: number,
): Promise<{success: boolean; updatedChallengesIds: number[]}> {
  if (!userId || challengeIds.length === 0 || secondsToAdd <= 0) {
    throw new Error("incorrect data to update progress");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(challengeParticipants)
      .set({
        progress: sql`${challengeParticipants.progress} + ${secondsToAdd}`,
      })
      .where(
        and(
          eq(challengeParticipants.userId, userId),
          inArray(challengeParticipants.challengeId, challengeIds),
        ),
      );

    for (const id of challengeIds) {
      await checkAndUpdateRaceChallenge(id, userId, tx);
    }
  });

  return {success: true, updatedChallengesIds: challengeIds};
}

export async function updateChallengeStatuses(): Promise<{
  updateCount: number;
}> {
  const now = new Date();
  let totalUpdated = 0;

  const challengesToActivate = await db
    .select({id: challenges.id})
    .from(challenges)
    .where(
      and(eq(challenges.status, "pending"), lte(challenges.startDate, now)),
    )
    .all();

  if (challengesToActivate.length > 0) {
    const idsToActivate = challengesToActivate.map((c) => c.id);
    await db
      .update(challenges)
      .set({status: "active"})
      .where(inArray(challenges.id, idsToActivate));
    totalUpdated += idsToActivate.length;
  }

  const activeChallenges = await db
    .select()
    .from(challenges)
    .where(eq(challenges.status, "active"))
    .all();

  const challengesToEndByTime: Challenge[] = [];
  for (const challenge of activeChallenges) {
    if (challenge.type !== "race" && challenge.daysAmount) {
      const endDate = new Date(challenge.startDate);
      endDate.setDate(endDate.getDate() + challenge.daysAmount);
      if (now > endDate) {
        challengesToEndByTime.push(challenge);
      }
    }
  }

  if (challengesToEndByTime.length > 0) {
    const idsToFinish = challengesToEndByTime.map((c) => c.id);

    await db.transaction(async (tx) => {
      await tx
        .update(challenges)
        .set({status: "finished"})
        .where(inArray(challenges.id, idsToFinish));

      await tx
        .update(challengeParticipants)
        .set({status: "failed"})
        .where(inArray(challengeParticipants.challengeId, idsToFinish));
    });

    totalUpdated += idsToFinish.length;
  }

  return {updateCount: totalUpdated};
}
