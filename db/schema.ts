import {sqliteTable, text, integer, primaryKey} from "drizzle-orm/sqlite-core";

// =================================================================
//                        ТАБЛИЦЯ КОРИСТУВАЧІВ (users)
// =================================================================
// Зберігає основну інформацію про кожного зареєстрованого користувача.
// -----------------------------------------------------------------
export const users = sqliteTable("users", {
  // 1. Унікальний ID, генерується автоматично
  id: integer("id").primaryKey({autoIncrement: true}),

  // 2. Нікнейм, має бути унікальним
  username: text("username").notNull().unique(),

  // 3. Хеш пароля (НІКОЛИ не зберігай пароль у відкритому вигляді)
  passwordHash: text("password_hash").notNull(),

  // 4. Градієнт аватара, зберігається як JSON-рядок ['#color1', '#color2']
  avatarGradient: text("avatar_gradient", {mode: "json"})
    .$type<string[]>()
    .notNull(),

  // 5. Денна ціль активності в хвилинах
  dailyGoalMinutes: integer("daily_goal_minutes").notNull(),

  coins: integer("coins").notNull().default(900),

  dailyProgress: integer("daily_progress").notNull().default(0),

  weeklyProgress: integer("weekly_progress").notNull().default(0),

  lastProgressUpdate: integer("last_progress_update", {mode: "timestamp_ms"}),

  // 6. Дата реєстрації (зберігається як число - Unix timestamp)
  createdAt: integer("created_at", {mode: "timestamp"})
    .notNull()
    .default(new Date()),
});

// =================================================================
//                        ТАБЛИЦЯ ЧЕЛЕНДЖІВ (challenges)
// =================================================================
// Описує кожен створений челендж.
// -----------------------------------------------------------------

// Створимо типи-переліки для безпеки даних
const challengeTypes = ["regular", "streak", "race", "team"] as const;
const challengeStatuses = ["active", "finished", "pending"] as const;

export const challenges = sqliteTable("challenges", {
  // 1. Унікальний ID челенджу
  id: integer("id").primaryKey({autoIncrement: true}),

  // 2. ID "хоста" - користувача, який створив челендж. Це зовнішній ключ до таблиці users.
  hostId: integer("host_id")
    .notNull()
    .references(() => users.id, {onDelete: "cascade"}),

  // 3. Тип челенджу (з нашого переліку)
  type: text("type", {enum: challengeTypes}).notNull(),

  // 4. Статус челенджу
  status: text("status", {enum: challengeStatuses})
    .notNull()
    .default("pending"),

  // 5. Опис дії, наприклад, "Читати книгу"
  action: text("action").notNull(),

  // 6. Кількість годин для виконання
  hoursAmount: integer("hours_amount").notNull(),

  // 7. Кількість днів (опціонально, для типів 'regular', 'streak')
  daysAmount: integer("days_amount"), // Може бути NULL

  // 8. Сума внеску для участі
  buyIn: integer("buy_in").notNull().default(0),

  // 9. Дата початку челенджу
  startDate: integer("start_date", {mode: "timestamp"}).notNull(),

  endDate: integer("end_date", {mode: "timestamp"}),
});

// =================================================================
//                   ТАБЛИЦЯ УЧАСНИКІВ ЧЕЛЕНДЖУ (challenge_participants)
// =================================================================
// Таблиця-зв'язок "багато-до-багатьох" між users і challenges.
// Показує, хто в якому челенджі бере участь.
// -----------------------------------------------------------------

const participantStatuses = ["in_progress", "completed", "failed"] as const;

export const challengeParticipants = sqliteTable(
  "challenge_participants",
  {
    // 1. ID користувача
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    // 2. ID челенджу
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challenges.id, {onDelete: "cascade"}),

    // 3. Поточний прогрес учасника (наприклад, виконані години)
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
    // Створюємо складений первинний ключ, щоб пара (користувач, челендж) була унікальною.
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

// =================================================================
//                       ТАБЛИЦЯ ДРУЖБИ (friendships)
// =================================================================
// Таблиця-зв'язок "багато-до-багатьох" між користувачами.
// Зберігає запити на дружбу та підтверджені зв'язки.
// -----------------------------------------------------------------

const friendshipStatuses = ["pending", "accepted", "blocked"] as const;

export const friendships = sqliteTable(
  "friendships",
  {
    // 1. ID користувача, який відправив запит (ініціатор)
    user1Id: integer("user1_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    // 2. ID користувача, який отримав запит
    user2Id: integer("user2_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),

    // 3. Статус їхніх відносин
    status: text("status", {enum: friendshipStatuses})
      .notNull()
      .default("pending"),
  },
  (table) => {
    // Унікальна пара користувачів
    return {
      pk: primaryKey({columns: [table.user1Id, table.user2Id]}),
    };
  },
);

// =================================================================
//                      ТАБЛИЦЯ СТАТИСТИКИ (user_statistics)
// =================================================================
// Можна зберігати агреговані дані тут, щоб не розраховувати їх щоразу.
// Наприклад, загальна кількість годин, завершених челенджів тощо.
// -----------------------------------------------------------------
export const userStatistics = sqliteTable("user_statistics", {
  // 1. ID користувача. Це одночасно і первинний, і зовнішній ключ (зв'язок "один-до-одного").
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, {onDelete: "cascade"}),

  // 2. Кількість завершених челенджів
  completedChallenges: integer("completed_challenges").notNull().default(0),

  // 3. Загальна кількість годин у всіх челенджах
  totalHours: integer("total_hours").notNull().default(0),

  // 4. Найдовший стрік (у днях)
  longestStreak: integer("longest_streak").notNull().default(0),
});

// =================================================================
//                      ТИПИ ДЛЯ ВИКОРИСТАННЯ В КОДІ
// =================================================================
// Це дозволить нам мати строгу типізацію при роботі з базою даних.
// -----------------------------------------------------------------
export type User = typeof users.$inferSelect; // тип для читання
export type NewUser = typeof users.$inferInsert; // тип для створення

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
