import {db} from "../db";
import {and, eq, or, inArray} from "drizzle-orm";
import {friendships, users} from "../../db/schema";
import type {SearchedUser} from "./authService";

export type Friend = {
  id: number;
  username: string;
  avatarGradient: string[];
  coins: number;
};

export async function getFriends(userId: number): Promise<Friend[]> {
  const relations = await db
    .select()
    .from(friendships)
    .where(
      and(
        or(eq(friendships.user1Id, userId), eq(friendships.user2Id, userId)),
        eq(friendships.status, "accepted"),
      ),
    )
    .all();

  if (relations.length === 0) return [];

  const friendsIds = relations.map((r) =>
    r.user1Id === userId ? r.user2Id : r.user1Id,
  );

  const friends = await db
    .select({
      id: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
      coins: users.coins,
    })
    .from(users)
    .where(inArray(users.id, friendsIds))
    .all();

  console.log(
    "!!! DATA FROM getFriends SERVICE:",
    JSON.stringify(friends, null, 2),
  );

  return friends;
}

export async function getPendingFriendRequests(
  userId: number,
  direction: "incoming" | "outgoing",
): Promise<Friend[]> {
  let requests;

  if (direction === "incoming") {
    requests = await db
      .select({
        otherUserId: friendships.user1Id,
      })
      .from(friendships)
      .where(
        and(eq(friendships.user2Id, userId), eq(friendships.status, "pending")),
      )
      .all();
  } else {
    requests = await db
      .select({
        otherUserId: friendships.user2Id,
      })
      .from(friendships)
      .where(
        and(eq(friendships.user1Id, userId), eq(friendships.status, "pending")),
      )
      .all();
  }

  if (requests.length === 0) return [];

  const otherUserIds = requests.map((r) => r.otherUserId);

  const otherUsers = await db
    .select({
      id: users.id,
      username: users.username,
      avatarGradient: users.avatarGradient,
    })
    .from(users)
    .where(inArray(users.id, otherUserIds))
    .all();

  return otherUsers;
}

export async function sendFriendRequest(
  senderId: number,
  receiverId: number,
): Promise<void> {
  if (senderId === receiverId)
    throw new Error("trying to send friend request to yourself");

  const user1Id = senderId;
  const user2Id = receiverId;

  const existing = await db
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.user1Id, user1Id), eq(friendships.user2Id, user2Id)),
        and(eq(friendships.user1Id, user2Id), eq(friendships.user2Id, user1Id)),
      ),
    )
    .get();

  if (existing) throw new Error("Friendship request alreaty sent");

  await db.insert(friendships).values({
    user1Id: user1Id,
    user2Id: user2Id,
    status: "pending",
  });
}

export async function handleFriendshipRequest(
  senderId: number,
  receiverId: number,
  action: "accept" | "decline",
): Promise<void> {
  const whereCondition = and(
    eq(friendships.user1Id, senderId),
    eq(friendships.user2Id, receiverId),
  );

  if (action === "accept") {
    await db
      .update(friendships)
      .set({
        status: "accepted",
      })
      .where(whereCondition);
  } else {
    await db.delete(friendships).where(whereCondition);
  }
}

export async function removeFriend(
  currentUserId: number,
  friendId: number,
): Promise<void> {
  await db
    .delete(friendships)
    .where(
      or(
        and(
          eq(friendships.user1Id, currentUserId),
          eq(friendships.user2Id, friendId),
        ),
        and(
          eq(friendships.user1Id, friendId),
          eq(friendships.user2Id, currentUserId),
        ),
      ),
    );
}
