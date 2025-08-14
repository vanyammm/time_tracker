import {db} from "../db";
import {eq, and, inArray, sql, lte, ne} from "drizzle-orm";
import {
  challenges,
  challengeParticipants,
  type Challenge,
  ChallengeParticipantDetails,
  users,
  GroupedChallenge,
  ChallengeWithMyDetails,
  User,
  challengeInvites,
  ChallengeType,
  PendingParticipant,
  NewParticipant,
} from "../../db/schema";
import {calculateStreakStats} from "../utils/utils";

export interface ChallengeCreationData {
  type: "Regular" | "Streak" | "Race" | "Team";
  action: string;
  hoursAmount: number;
  daysAmount?: number;
  buyIn: number;
  startDate: Date;
}

export async function createChallenge(
  challengeData: ChallengeCreationData,
  hostId: number,
) {
  if (!hostId) {
    throw new Error("Host ID is required to create a challenge.");
  }

  const hostUser = await db
    .select({
      coins: users.coins,
    })
    .from(users)
    .where(eq(users.id, hostId))
    .get();

  if (!hostUser || hostUser.coins < challengeData.buyIn) {
    throw new Error("Not enough coins to buy in");
  }

  const newChallenge = await db.transaction(async (tx) => {
    if (challengeData.buyIn > 0) {
      await tx
        .update(users)
        .set({coins: sql`${users.coins} - ${challengeData.buyIn}`})
        .where(eq(users.id, hostId));
    }

    const startDate = challengeData.startDate;
    let endDate: Date | null = null;

    if (challengeData.daysAmount && challengeData.daysAmount > 0) {
      endDate = new Date(startDate.getTime());

      endDate.setDate(startDate.getDate() + challengeData.daysAmount);
    }

    const inititalStatus = startDate <= new Date() ? "active" : "pending";

    const insertedChallenge = await tx
      .insert(challenges)
      .values({
        hostId,
        type: challengeData.type.toLowerCase() as ChallengeType,
        action: challengeData.action,
        hoursAmount: challengeData.hoursAmount,
        daysAmount: challengeData.daysAmount,
        buyIn: challengeData.buyIn,
        startDate: startDate,
        endDate: endDate,
        status: inititalStatus,
      })
      .returning()
      .get();

    if (!insertedChallenge) {
      tx.rollback();
      throw new Error("Failed to create challenge.");
    }

    const participantData: NewParticipant = {
      userId: hostId,
      challengeId: insertedChallenge.id,
      progress: 0,
    };

    if (challengeData.type === "Streak" && challengeData.daysAmount) {
      participantData.dailyStreakProgress = Array(
        challengeData.daysAmount,
      ).fill(0);
    }
    await tx.insert(challengeParticipants).values(participantData);
    return insertedChallenge;
  });

  return newChallenge;
}

export async function getChallengeById(
  challengeId: number,
  userId: number,
): Promise<ChallengeWithMyDetails | null> {
  if (!challengeId || !userId) {
    return null;
  }

  const result = await db
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
      endDate: challenges.endDate,
      myProgress: challengeParticipants.progress,
      myStatus: challengeParticipants.status,
      isResultViewed: challengeParticipants.isResultViewed,
      myDailyStreakProgress: challengeParticipants.dailyStreakProgress,
    })
    .from(challenges)
    .innerJoin(
      challengeParticipants,
      eq(challenges.id, challengeParticipants.challengeId),
    )
    .where(
      and(
        eq(challenges.id, challengeId),
        eq(challengeParticipants.userId, userId),
      ),
    )
    .get();

  return result ?? null;
}

export async function getFeedChallenges(
  userId: number,
): Promise<ChallengeWithMyDetails[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch challenges.");
    return [];
  }

  const allUserChallenges = await db
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
      myProgress: challengeParticipants.progress,
      myStatus: challengeParticipants.status,
      isResultViewed: challengeParticipants.isResultViewed,
      myDailyStreakProgress: challengeParticipants.dailyStreakProgress,
    })
    .from(challengeParticipants)
    .innerJoin(challenges, eq(challengeParticipants.challengeId, challenges.id))
    .where(eq(challengeParticipants.userId, userId));

  const feedChallenges = allUserChallenges.filter((challenge) => {
    if (challenge.status === "active" || challenge.status === "pending") {
      return true;
    }
    if (challenge.status === "finished" && !challenge.isResultViewed) {
      return true;
    }
    return false;
  });

  return feedChallenges;
}

export async function getAcrhivedChallenges(
  userId: number,
): Promise<ChallengeWithMyDetails[]> {
  if (!userId) return [];

  const archivedChallenges = await db
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
      endDate: challenges.endDate,
      myProgress: challengeParticipants.progress,
      myStatus: challengeParticipants.status,
      isResultViewed: challengeParticipants.isResultViewed,
      myDailyStreakProgress: challengeParticipants.dailyStreakProgress,
    })
    .from(challengeParticipants)
    .innerJoin(challenges, eq(challengeParticipants.challengeId, challenges.id))
    .where(
      and(
        eq(challengeParticipants.userId, userId),
        eq(challenges.status, "finished"),
        eq(challengeParticipants.isResultViewed, true),
      ),
    );

  return archivedChallenges;
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
  const challenge = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .get();

  if (!challenge) {
    return [];
  }

  const participantsList = await db
    .select({
      userId: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
      progress: challengeParticipants.progress,
      status: challengeParticipants.status,
      dailyStreakProgress: challengeParticipants.dailyStreakProgress,
    })
    .from(challengeParticipants)
    .innerJoin(users, eq(challengeParticipants.userId, users.id))
    .where(eq(challengeParticipants.challengeId, challengeId))
    .all();

  participantsList.sort((a, b) => {
    const statusOrder = {completed: 3, in_progress: 2, failed: 1};
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[b.status] - statusOrder[a.status];
    }

    if (challenge.type === "streak") {
      const now = new Date();
      const daysPassed =
        Math.floor(
          (now.getTime() - new Date(challenge.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1;

      const streakA = a.dailyStreakProgress || [];
      const streakB = b.dailyStreakProgress || [];

      const statsA = calculateStreakStats(
        streakA,
        challenge.hoursAmount,
        daysPassed,
      );
      const statsB = calculateStreakStats(
        streakB,
        challenge.hoursAmount,
        daysPassed,
      );

      if (statsA.wonDays !== statsB.wonDays) {
        return statsB.wonDays - statsA.wonDays;
      }

      const todayIndex = daysPassed - 1;
      const progressTodayA = streakA[todayIndex] || 0;
      const progressTodayB = streakB[todayIndex] || 0;

      if (progressTodayA !== progressTodayB) {
        return progressTodayB - progressTodayA;
      }

      return b.progress - a.progress;
    } else {
      return b.progress - a.progress;
    }
  });

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
): Promise<{
  success: boolean;
  updatedUser: User;
  updatedChallengesIds: number[];
}> {
  if (!userId || secondsToAdd <= 0) {
    throw new Error(
      `incorrect data to update progress, userId:${userId}, secondsToAdd: ${secondsToAdd}, challengeIds:${challengeIds}`,
    );
  }

  const now = new Date();
  const todayStart = new Date(now).setHours(0, 0, 0, 0);

  const currentUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!currentUser) throw new Error("Error in finding user");

  let newDailyProgress = secondsToAdd;
  let newWeeklyProgress = secondsToAdd;

  if (currentUser.lastProgressUpdate) {
    const lastUpdateDate = new Date(currentUser.lastProgressUpdate);

    if (lastUpdateDate.setHours(0, 0, 0, 0) === todayStart) {
      newDailyProgress += currentUser.dailyProgress;
    }

    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    if (lastUpdateDate >= startOfWeek) {
      newWeeklyProgress += currentUser.weeklyProgress;
    }
  }

  const updatedUsers = await db
    .update(users)
    .set({
      dailyProgress: newDailyProgress,
      weeklyProgress: newWeeklyProgress,
      lastProgressUpdate: now,
    })
    .where(eq(users.id, userId))
    .returning();

  const updatedUser = updatedUsers[0];

  if (!updatedUser) {
    throw new Error("Failed to update user progress.");
  }

  const activeChallenges = await db
    .select({
      id: challenges.id,
    })
    .from(challenges)
    .where(
      and(
        inArray(challenges.id, challengeIds),
        eq(challenges.status, "active"),
      ),
    )
    .all();

  if (!activeChallenges.length) {
    return {success: true, updatedUser, updatedChallengesIds: []};
  }

  const activeChallengesIds = activeChallenges.map((c) => c.id);

  if (challengeIds.length > 0) {
    await db.transaction(async (tx) => {
      await tx
        .update(challengeParticipants)
        .set({
          progress: sql`${challengeParticipants.progress} + ${secondsToAdd}`,
        })
        .where(
          and(
            eq(challengeParticipants.userId, userId),
            inArray(challengeParticipants.challengeId, activeChallengesIds),
          ),
        );

      const streakChallenges = await tx
        .select()
        .from(challenges)
        .where(
          and(
            inArray(challenges.id, activeChallengesIds),
            eq(challenges.type, "streak"),
          ),
        );

      if (streakChallenges.length > 0) {
        const streakChallengeIds = streakChallenges.map((c) => c.id);

        const participantsToUpdate = await tx
          .select()
          .from(challengeParticipants)
          .where(
            and(
              eq(challengeParticipants.userId, userId),
              inArray(challengeParticipants.challengeId, streakChallengeIds),
            ),
          );

        for (const participant of participantsToUpdate) {
          const challenge = streakChallenges.find(
            (c) => c.id === participant.challengeId,
          )!;

          const daysPassed = Math.floor(
            (now.getTime() - new Date(challenge.startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          );

          if (daysPassed >= 0 && daysPassed < challenge.daysAmount!) {
            const dayIndex = daysPassed;

            const currentStreakProgress =
              participant.dailyStreakProgress ||
              Array(challenge.daysAmount!).fill(0);

            currentStreakProgress[dayIndex] =
              (currentStreakProgress[dayIndex] || 0) + secondsToAdd;

            await tx
              .update(challengeParticipants)
              .set({
                dailyStreakProgress: currentStreakProgress,
              })
              .where(
                and(
                  eq(challengeParticipants.userId, userId),
                  eq(
                    challengeParticipants.challengeId,
                    participant.challengeId,
                  ),
                ),
              );
          }
        }
      }

      for (const id of activeChallengesIds) {
        await checkAndUpdateRaceChallenge(id, userId, tx);
      }
    });
  }

  return {
    success: true,
    updatedUser,
    updatedChallengesIds: activeChallengesIds,
  };
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

  const activeChallengesToEnd = await db
    .select()
    .from(challenges)
    .where(and(eq(challenges.status, "active"), lte(challenges.endDate, now)))
    .all();

  if (activeChallengesToEnd.length === 0) {
    return {updateCount: totalUpdated};
  }

  const idsToFinish = activeChallengesToEnd.map((c) => c.id);

  const participantsToUpdate = await db
    .select()
    .from(challengeParticipants)
    .where(inArray(challengeParticipants.challengeId, idsToFinish));

  await db.transaction(async (tx) => {
    await tx
      .update(challenges)
      .set({status: "finished"})
      .where(inArray(challenges.id, idsToFinish));

    for (const challenge of activeChallengesToEnd) {
      const currentChallengeParticipants = participantsToUpdate.filter(
        (p) => p.challengeId === challenge.id,
      );

      if (challenge.type === "team") {
        const totalTeamProgress = currentChallengeParticipants.reduce(
          (sum, p) => sum + p.progress,
          0,
        );
        const totalTeamProgressHours = totalTeamProgress / 3600;
        const isTeamGoalMet = totalTeamProgressHours >= challenge.hoursAmount;

        const newStatus = isTeamGoalMet ? "completed" : "failed";
        await tx
          .update(challengeParticipants)
          .set({status: newStatus})
          .where(eq(challengeParticipants.challengeId, challenge.id));
      } else {
        for (const participant of currentChallengeParticipants) {
          let newStatus: "completed" | "failed" = "failed";

          if (challenge.type === "streak" && challenge.daysAmount) {
            const dailyGoalInSeconds = challenge.hoursAmount * 3600;

            const streakProgress = participant.dailyStreakProgress || [];

            const isStreakCompleted = Array.from(
              {length: challenge.daysAmount},
              (_, i) => streakProgress[i] || 0,
            ).every((dailyProgress) => dailyProgress >= dailyGoalInSeconds);

            if (isStreakCompleted) newStatus = "completed";
          } else if (challenge.type === "regular") {
            const hoursProgress = participant.progress / 3600;
            if (hoursProgress >= challenge.hoursAmount) newStatus = "completed";
          }

          await tx
            .update(challengeParticipants)
            .set({status: newStatus})
            .where(
              and(
                eq(challengeParticipants.userId, participant.userId),
                eq(challengeParticipants.challengeId, participant.challengeId),
              ),
            );
        }
      }
    }
  });

  totalUpdated += idsToFinish.length;

  return {updateCount: totalUpdated};
}

export async function markChallengeAsViewed(
  userId: number,
  challengeId: number,
): Promise<void> {
  await db.transaction(async (tx) => {
    const participant = await tx
      .select()
      .from(challengeParticipants)
      .where(
        and(
          eq(challengeParticipants.userId, userId),
          eq(challengeParticipants.challengeId, challengeId),
        ),
      )
      .get();

    const challenge = await tx
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .get();

    if (!participant || !challenge || participant.status !== "completed") {
      await tx
        .update(challengeParticipants)
        .set({isResultViewed: true})
        .where(
          and(
            eq(challengeParticipants.userId, userId),
            eq(challengeParticipants.challengeId, challengeId),
          ),
        );

      return;
    }

    const allParticipants = await tx
      .select()
      .from(challengeParticipants)
      .where(eq(challengeParticipants.challengeId, challengeId))
      .all();

    const prizePool = challenge.buyIn * allParticipants.length;

    const winners = allParticipants.filter((p) => p.status === "completed");
    const winnersCount = winners.length;

    let winnings = 0;
    if (winnersCount > 0) {
      winnings = Math.floor(prizePool / winnersCount);
    }

    await tx
      .update(users)
      .set({coins: sql`${users.coins} + ${winnings}`})
      .where(eq(users.id, userId));

    await tx
      .update(challengeParticipants)
      .set({isResultViewed: true})
      .where(
        and(
          eq(challengeParticipants.userId, userId),
          eq(challengeParticipants.challengeId, challengeId),
        ),
      );
  });
}

export type ChallengeInviteDetails = {
  challengeId: number;
  challengeAction: string;
  challengeDaysAmount: number | null;
  challengeHoursAmount: number;
  challengeType: ChallengeType;
  senderId: number;
  senderUsername: string;
  buyIn: number;
  startDate: Date;
};

export async function sendChallengeInvite(
  challengeId: number,
  senderId: number,
  receiverId: number,
): Promise<void> {
  const challenge = await db
    .select({hostId: challenges.hostId})
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .get();

  if (!challenge || challenge.hostId !== senderId) {
    throw new Error(
      "Incorrect data passed to the sendChallengeInvite function",
    );
  }

  const existingParticipant = await db
    .select()
    .from(challengeParticipants)
    .where(
      and(
        eq(challengeParticipants.challengeId, challengeId),
        eq(challengeParticipants.userId, receiverId),
      ),
    )
    .get();

  const existingInvite = await db
    .select()
    .from(challengeInvites)
    .where(
      and(
        eq(challengeInvites.challengeId, challengeId),
        eq(challengeInvites.receiverId, receiverId),
      ),
    )
    .get();

  if (existingInvite || existingParticipant) {
    throw new Error(
      "User already has an invite or user is already a challenge participant",
    );
  }

  await db.insert(challengeInvites).values({
    challengeId,
    senderId,
    receiverId,
  });
}

export async function getPendingChallengeInvites(
  userId: number,
): Promise<ChallengeInviteDetails[]> {
  const invites = await db
    .select({
      challengeId: challenges.id,
      challengeAction: challenges.action,
      challengeDaysAmount: challenges.daysAmount,
      challengeHoursAmount: challenges.hoursAmount,
      challengeType: challenges.type,
      senderId: users.id,
      senderUsername: users.username,
      buyIn: challenges.buyIn,
      startDate: challenges.startDate,
    })
    .from(challengeInvites)
    .innerJoin(challenges, eq(challengeInvites.challengeId, challenges.id))
    .innerJoin(users, eq(challengeInvites.senderId, users.id))
    .where(
      and(
        eq(challengeInvites.receiverId, userId),
        eq(challengeInvites.status, "pending"),
      ),
    )
    .all();

  return invites;
}

export async function handleChallengeInvite(
  challengeId: number,
  receiverId: number,
  action: "accept" | "decline",
): Promise<void> {
  if (action === "accept") {
    await db.transaction(async (tx) => {
      const challenge = await tx
        .select({buyIn: challenges.buyIn})
        .from(challenges)
        .where(eq(challenges.id, challengeId))
        .get();

      const user = await tx
        .select({coins: users.coins})
        .from(users)
        .where(eq(users.id, receiverId))
        .get();

      if (!challenge || !user) {
        throw new Error("Challenge or user not found");
      }
      if (user.coins < challenge.buyIn) {
        throw new Error("Not enough coins to join this challenge");
      }

      if (challenge.buyIn > 0) {
        await tx
          .update(users)
          .set({coins: sql`${users.coins} - ${challenge.buyIn}`})
          .where(eq(users.id, receiverId));
      }

      await tx.insert(challengeParticipants).values({
        userId: receiverId,
        challengeId,
        progress: 0,
      });

      await tx
        .update(challengeInvites)
        .set({
          status: "accepted",
        })
        .where(
          and(
            eq(challengeInvites.challengeId, challengeId),
            eq(challengeInvites.receiverId, receiverId),
          ),
        );
    });
  } else {
    await db
      .delete(challengeInvites)
      .where(
        and(
          eq(challengeInvites.challengeId, challengeId),
          eq(challengeInvites.receiverId, receiverId),
        ),
      );
  }
}

export async function getChallengePendingStatus(
  challengeId: number,
): Promise<PendingParticipant[]> {
  const participants = await db
    .select({
      id: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
    })
    .from(challengeParticipants)
    .innerJoin(users, eq(challengeParticipants.userId, users.id))
    .where(eq(challengeParticipants.challengeId, challengeId))
    .all();

  const invited = await db
    .select({
      id: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
    })
    .from(challengeInvites)
    .innerJoin(users, eq(challengeInvites.receiverId, users.id))
    .where(
      and(
        eq(challengeInvites.challengeId, challengeId),
        eq(challengeInvites.status, "pending"),
      ),
    )
    .all();

  const result: PendingParticipant[] = [];

  participants.forEach((p) => {
    result.push({...p, status: "participant"});
  });

  invited.forEach((i) => {
    if (!result.some((r) => r.id === i.id)) {
      result.push({...i, status: "invited"});
    }
  });

  return result;
}

export async function deleteChallenge(
  challengeId: number,
  hostId: number,
): Promise<void> {
  const challenge = await db
    .select({hostId: challenges.hostId})
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .get();

  if (!challenge) {
    throw new Error("Challenge not found.");
  }

  if (challenge.hostId !== hostId) {
    throw new Error(
      "You are not the host of this challenge and cannot delete it.",
    );
  }

  await db.delete(challenges).where(eq(challenges.id, challengeId));
}
