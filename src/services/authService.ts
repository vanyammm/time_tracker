import * as Crypto from "expo-crypto";
import {
  eq,
  like,
  ne,
  and,
  desc,
  sql,
  inArray,
  not,
  isNull,
  lt,
  or,
  notInArray,
} from "drizzle-orm";
import {db} from "../db";
import {
  LeaderboardEntry,
  LeaderboardResult,
  users,
  friendships,
  type NewUser,
  User,
} from "../../db/schema";
import {getFriends} from "./friendshipService";

interface SignUpData {
  username?: string;
  password?: string;
  avatarGradient?: string[] | null;
  dailyGoalMinutes?: number;
}

export async function signUp(userData: SignUpData) {
  const {username, password, avatarGradient, dailyGoalMinutes} = userData;

  if (!username || !password || !avatarGradient || !dailyGoalMinutes) {
    throw new Error("Будь ласка, заповніть всі необхідні поля.");
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
  if (existingUser) {
    throw new Error("Користувач з таким нікнеймом вже існує.");
  }

  const passwordHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );

  const newUser = await db
    .insert(users)
    .values({
      username,
      passwordHash,
      avatarGradient,
      dailyGoalMinutes,
      createdAt: new Date(),
    })
    .returning()
    .get();

  return newUser;
}

export async function signIn(username?: string, password?: string) {
  if (!username || !password) {
    throw new Error("Введіть нікнейм та пароль.");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
  if (!user) {
    throw new Error("Неправильний нікнейм або пароль.");
  }

  const hashedInputPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );

  if (hashedInputPassword !== user.passwordHash) {
    throw new Error("Неправильний нікнейм або пароль.");
  }

  return user;
}

export async function getUserById(id: number) {
  const user = await db.select().from(users).where(eq(users.id, id)).get();
  if (!user) {
    console.warn(`User with ID ${id} not found in DB.`);
    return null;
  }
  return user;
}

export type SearchedUser = {
  id: number;
  username: string;
  avatarGradient: string[];
};

export async function findUsersByUsername(
  query: string,
  currentUserId: number,
): Promise<SearchedUser[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const existingRelations = await db
    .select()
    .from(friendships)
    .where(
      or(
        eq(friendships.user1Id, currentUserId),
        eq(friendships.user2Id, currentUserId),
      ),
    )
    .all();

  const idsToExclude: number[] = [currentUserId];
  existingRelations.forEach((relation) => {
    if (relation.user1Id !== currentUserId) {
      idsToExclude.push(relation.user1Id);
    }
    if (relation.user2Id !== currentUserId) {
      idsToExclude.push(relation.user2Id);
    }
  });

  const foundUsers = await db
    .select({
      id: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
    })
    .from(users)
    .where(
      and(
        like(users.username, `%${query}%`),
        notInArray(users.id, idsToExclude),
      ),
    )
    .limit(15)
    .all();

  return foundUsers;
}

export type LeaderboardFilter = "global" | "friends";
export type LeaderboardPeriod = "daily" | "weekly";

export async function getLeaderboard(
  currentUserId: number,
  filter: LeaderboardFilter,
  period: LeaderboardPeriod,
): Promise<LeaderboardResult> {
  const progressField =
    period === "daily" ? users.dailyProgress : users.weeklyProgress;

  let userIds: number[] | undefined = undefined;
  if (filter === "friends") {
    const friends = await getFriends(currentUserId);
    userIds = [...friends.map((f) => f.id), currentUserId];
  }

  const whereCondition = userIds ? inArray(users.id, userIds) : undefined;

  const allRankedUsers = await db
    .select({
      userId: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
      progress: progressField,
    })
    .from(users)
    .where(whereCondition)
    .orderBy(desc(sql`${progressField} * 1`), desc(users.id));

  let currentUserEntry: LeaderboardEntry | null = null;

  const leaderboardEntries: LeaderboardEntry[] = allRankedUsers.map(
    (user, index) => {
      const rank = index + 1;
      const entry: LeaderboardEntry = {...user, rank};

      if (user.userId === currentUserId) {
        currentUserEntry = entry;
      }

      return entry;
    },
  );

  const top10 = leaderboardEntries.slice(0, 10);

  const isCurrentUserInTop10 = top10.some((u) => u.userId === currentUserId);

  return {
    top10,
    currentUser: isCurrentUserInTop10 ? null : currentUserEntry,
  };
}

export async function resetUserProgressIfNeeded(): Promise<{
  dailyResets: number;
  weeklyResets: number;
}> {
  const now = new Date();
  const todayStart = new Date(now).setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const usersToResetDaily = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(
      and(
        not(isNull(users.lastProgressUpdate)),
        lt(users.lastProgressUpdate, new Date(todayStart)),
      ),
    )
    .all();

  const usersToResetWeekly = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(
      and(
        not(isNull(users.lastProgressUpdate)),
        lt(users.lastProgressUpdate, startOfWeek),
      ),
    )
    .all();

  if (usersToResetDaily.length > 0) {
    const ids = usersToResetDaily.map((u) => u.id);
    await db
      .update(users)
      .set({
        dailyProgress: 0,
      })
      .where(inArray(users.id, ids));
  }

  if (usersToResetWeekly.length > 0) {
    const ids = usersToResetWeekly.map((u) => u.id);
    await db
      .update(users)
      .set({
        weeklyProgress: 0,
      })
      .where(inArray(users.id, ids));
  }

  return {
    dailyResets: usersToResetDaily.length,
    weeklyResets: usersToResetWeekly.length,
  };
}

export interface UserUpdateData {
  username?: string;
  avatarGradient?: string[];
}

export async function updateUserProfile(
  userId: number,
  data: UserUpdateData,
): Promise<User> {
  if (!userId || Object.keys(data).length === 0) {
    throw new Error("User ID and update data must be provided");
  }

  const updatedUser = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning()
    .get();

  if (!updatedUser) {
    throw new Error("User not found, could not update profile");
  }

  return updatedUser;
}

export async function updateUserDailyGoal(
  userId: number,
  dailyGoalMinutes: number,
): Promise<User> {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const goal = Math.max(0, dailyGoalMinutes);

  const updatedUser = await db
    .update(users)
    .set({dailyGoalMinutes: goal})
    .where(eq(users.id, userId))
    .returning()
    .get();

  if (!updatedUser) {
    throw new Error("User not found, could not update daily goal.");
  }

  return updatedUser;
}
