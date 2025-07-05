// src/services/authService.ts
import * as Crypto from "expo-crypto";
import {eq} from "drizzle-orm";
import {db} from "../db"; // Імпортуємо наш db інстанс
import {users, type NewUser} from "../../db/schema"; // Імпортуємо схему і тип

interface SignUpData {
  username?: string;
  password?: string;
  avatarGradient?: string[] | null;
  dailyGoalMinutes?: number;
}

// Функція реєстрації
export async function signUp(userData: SignUpData) {
  const {username, password, avatarGradient, dailyGoalMinutes} = userData;

  if (!username || !password || !avatarGradient || !dailyGoalMinutes) {
    throw new Error("Будь ласка, заповніть всі необхідні поля.");
  }

  // Перевірка, чи існує користувач
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
  if (existingUser) {
    throw new Error("Користувач з таким нікнеймом вже існує.");
  }

  // Хешування пароля
  const passwordHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );

  // Вставляємо нового користувача в базу
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

// Функція входу
export async function signIn(username?: string, password?: string) {
  if (!username || !password) {
    throw new Error("Введіть нікнейм та пароль.");
  }

  // Знаходимо користувача
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
  if (!user) {
    throw new Error("Неправильний нікнейм або пароль."); // Завжди однакова помилка для безпеки
  }

  // Хешуємо введений пароль і порівнюємо з хешем в базі
  const hashedInputPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );

  if (hashedInputPassword !== user.passwordHash) {
    throw new Error("Неправильний нікнейм або пароль.");
  }

  // Якщо все добре, повертаємо дані користувача
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
