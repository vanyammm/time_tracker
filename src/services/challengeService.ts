import {db} from "../db";
import {eq} from "drizzle-orm";
import {
  challenges,
  challengeParticipants,
  type Challenge,
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
        status: "pending",
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
