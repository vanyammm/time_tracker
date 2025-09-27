import {sqliteTable, text, integer, primaryKey} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({autoIncrement: true}),

  username: text("username").notNull().unique(),

  passwordHash: text("password_hash").notNull(),

  avatarGradient: text("avatar_gradient", {mode: "json"})
    .$type<string[]>()
    .notNull(),

  dailyGoalMinutes: integer("daily_goal_minutes").notNull(),

  coins: integer("coins").notNull().default(900),

  dailyProgress: integer("daily_progress").notNull().default(0),

  weeklyProgress: integer("weekly_progress").notNull().default(0),

  lastProgressUpdate: integer("last_progress_update", {mode: "timestamp_ms"}),

  createdAt: integer("created_at", {mode: "timestamp"})
    .notNull()
    .default(new Date()),
});

const challengeTypes = ["regular", "streak", "race", "team"] as const;
const challengeStatuses = ["active", "finished", "pending"] as const;

export const challenges = sqliteTable("challenges", {
  id: integer("id").primaryKey({autoIncrement: true}),

  hostId: integer("host_id")
    .notNull()
    .references(() => users.id, {onDelete: "cascade"}),

  type: text("type", {enum: challengeTypes}).notNull(),

  status: text("status", {enum: challengeStatuses})
    .notNull()
    .default("pending"),

  action: text("action").notNull(),

  hoursAmount: integer("hours_amount").notNull(),

  daysAmount: integer("days_amount"),

  buyIn: integer("buy_in").notNull().default(0),

  startDate: integer("start_date", {mode: "timestamp"}).notNull(),

  endDate: integer("end_date", {mode: "timestamp"}),
});

const participantStatuses = ["in_progress", "completed", "failed"] as const;

export const challengeParticipants = sqliteTable(
  "challenge_participants",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, {onDelete: "cascade"}),

    progress: integer("progress").notNull().default(0),
    dailyStreakProgress: text("daily_streak_progress", {mode: "json"}).$type<
      number[]
    >(),
    status: text("status", {enum: participantStatuses})
      .notNull()
      .default("in_progress"),
    isResultViewed: integer("is_result_viewed", {mode: "boolean"})
      .notNull()
      .default(false),
  },
  (table) => {
    return {
      pk: primaryKey({columns: [table.userId, table.challengeId]}),
    };
  },
);

const inviteStatuses = ["pending", "accepted", "declined"] as const;

export const challengeInvites = sqliteTable(
  "challenge_invites",
  {
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, {onDelete: "cascade"}),

    senderId: integer("sender_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    receiverId: integer("receiver_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    status: text("status", {enum: inviteStatuses}).notNull().default("pending"),
  },
  (table) => {
    return {
      pk: primaryKey({columns: [table.challengeId, table.receiverId]}),
    };
  },
);

const friendshipStatuses = ["pending", "accepted", "blocked"] as const;

export const friendships = sqliteTable(
  "friendships",
  {
    user1Id: integer("user1_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    user2Id: integer("user2_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    status: text("status", {enum: friendshipStatuses})
      .notNull()
      .default("pending"),
  },
  (table) => {
    return {
      pk: primaryKey({columns: [table.user1Id, table.user2Id]}),
    };
  },
);

export const userStatistics = sqliteTable("user_statistics", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, {onDelete: "cascade"}),

  completedChallenges: integer("completed_challenges").notNull().default(0),

  totalHours: integer("total_hours").notNull().default(0),

  longestStreak: integer("longest_streak").notNull().default(0),
});

export type User = typeof users.$inferSelect; 
export type NewUser = typeof users.$inferInsert;

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;

export type Participant = typeof challengeParticipants.$inferSelect;
export type NewParticipant = typeof challengeParticipants.$inferInsert;

export type ChallengeParticipantDetails = {
  userId: number;
  username: string;
  avatarGradient: string[];
  progress: number;
  dailyStreakProgress: number[] | null;
  status: "in_progress" | "completed" | "failed";
};

export type GroupedChallenge = {
  action: string;
  challengeIds: number[];
};

export type ChallengeWithMyDetails = Challenge & {
  myProgress: number;
  myStatus: "in_progress" | "completed" | "failed";
  isResultViewed: boolean;
  myDailyStreakProgress: number[] | null;
};

export type LeaderboardEntry = {
  rank: number;
  userId: number;
  username: string;
  avatarGradient: string[];
  progress: number;
};

export type LeaderboardResult = {
  top10: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
};

export type ChallengeType = "race" | "streak" | "team" | "regular";
export type ChallengeStatus = "active" | "finished" | "pending";
export type ParticipantStatus = "failed" | "completed" | "in_progress";

export type PendingParticipant = {
  id: number;
  username: string;
  avatarGradient: string[];
  status: "participant" | "invited";
};
