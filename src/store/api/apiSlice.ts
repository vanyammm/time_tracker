import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {
  getUserById,
  signIn,
  signUp,
  findUsersByUsername,
  type SearchedUser,
  LeaderboardFilter,
  LeaderboardPeriod,
  getLeaderboard,
  resetUserProgressIfNeeded,
  UserUpdateData,
  updateUserProfile,
  updateUserDailyGoal,
} from "../../services/authService";
import {
  getFriends,
  getPendingFriendRequests,
  sendFriendRequest,
  handleFriendshipRequest,
  Friend,
  removeFriend,
} from "../../services/friendshipService";
import type {
  User,
  Challenge,
  ChallengeParticipantDetails,
  GroupedChallenge,
  ChallengeWithMyDetails,
  LeaderboardResult,
  PendingParticipant,
} from "../../../db/schema";
import {
  toChallengeForState,
  toChallengeInvitesForState,
  toChallengesForState,
  toUserForState,
} from "../../utils/utils";
import type {RegistrationData} from "../../context/OnboardingContext";
import {
  ChallengeCreationData,
  createChallenge,
  getChallengeById,
  getFeedChallenges,
  getAcrhivedChallenges,
  getParticipantsByChallengeId,
  getGroupedActiveChallenges,
  addProgressToChallenges,
  updateChallengeStatuses,
  markChallengeAsViewed,
  ChallengeInviteDetails,
  getPendingChallengeInvites,
  sendChallengeInvite,
  handleChallengeInvite,
  getChallengePendingStatus,
  deleteChallenge,
} from "../../services/challengeService";

import {QueryBuilder} from "drizzle-orm/gel-core";

export type UserForState = Omit<User, "createdAt" | "lastProgressUpdate"> & {
  createdAt: string;
  lastProgressUpdate: string | null;
};

interface CreateChallengeArgs {
  challengeData: ChallengeCreationData;
  hostId: number;
}

interface AddProgressArgs {
  userId: number;
  challengeIds: number[];
  secondsToAdd: number;
}

interface MarkAsViewedArgs {
  userId: number;
  challengeId: number;
}

interface GetChallengeByIdArgs {
  challengeId: number;
  userId: number;
}

interface getLeaderboardArgs {
  currentUserId: number;
  filter: LeaderboardFilter;
  period: LeaderboardPeriod;
}

interface getPendingFriendRequestsArgs {
  userId: number;
  direction: "incoming" | "outgoing";
}

interface HandleFriendRequestArgs {
  senderId: number;
  receiverId: number;
  action: "accept" | "decline";
}

export interface removeFriendArgs {
  currentUserId: number;
  friendId: number;
}

interface TriggerUpdateResult {
  updatedChallengesCount: number;
  dailyProgressResets: number;
  weeklyProgressResets: number;
}

interface SendChallengeInviteArgs {
  challengeId: number;
  senderId: number;
  receiverId: number;
}

interface HandleChallengeInviteArgs {
  challengeId: number;
  receiverId: number;
  action: "accept" | "decline";
}

interface UpdateUserProfileArgs {
  userId: number;
  data: UserUpdateData;
}

interface UpdateUserDailyGoalArgs {
  userId: number;
  dailyGoalMinutes: number;
}

interface DeleteChallengeArgs {
  challengeId: number;
  hostId: number;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "User",
    "Challenge",
    "Participant",
    "Friend",
    "Leaderboard",
    "ChallengeInvite",
    "ChallengePendingStatus",
  ],
  endpoints: (builder) => ({
    signIn: builder.mutation<
      UserForState,
      {username?: string; password?: string}
    >({
      queryFn: async (credentials) => {
        try {
          const user = await signIn(credentials.username, credentials.password);
          return {data: toUserForState(user)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: ["User"],
    }),
    signUp: builder.mutation<UserForState, RegistrationData>({
      queryFn: async (userData) => {
        try {
          const newUser = await signUp(userData);
          return {data: toUserForState(newUser)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<UserForState, UpdateUserProfileArgs>({
      queryFn: async ({userId, data}) => {
        try {
          const updatedUser = await updateUserProfile(userId, data);
          return {data: toUserForState(updatedUser)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: ["User"],
    }),
    updateUserDailyGoal: builder.mutation<
      UserForState,
      UpdateUserDailyGoalArgs
    >({
      queryFn: async ({userId, dailyGoalMinutes}) => {
        try {
          const updatedUser = await updateUserDailyGoal(
            userId,
            dailyGoalMinutes,
          );
          return {data: toUserForState(updatedUser)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query<User, number>({
      queryFn: async (userId) => {
        try {
          const user = await getUserById(userId);
          return {data: toUserForState(user as User)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
    }),
    findUsers: builder.query<
      SearchedUser[],
      {query: string; currentUserId: number}
    >({
      queryFn: async ({query, currentUserId}) => {
        try {
          const users = await findUsersByUsername(query, currentUserId);
          return {data: users};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
    }),
    getLeaderboard: builder.query<LeaderboardResult, getLeaderboardArgs>({
      queryFn: async ({currentUserId, filter, period}) => {
        try {
          const result = await getLeaderboard(currentUserId, filter, period);
          return {data: result};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: ["Leaderboard", "Friend", "User"],
    }),
    getFriends: builder.query<Friend[], number>({
      queryFn: async (userId) => {
        try {
          const friends = await getFriends(userId);
          return {data: friends};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: (result) => [{type: "Friend", id: "LIST"}],
    }),
    getPendingFriendRequests: builder.query<
      Friend[],
      getPendingFriendRequestsArgs
    >({
      queryFn: async ({userId, direction}) => {
        try {
          const requests = await getPendingFriendRequests(userId, direction);
          return {data: requests};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: (result, error, {direction}) => [
        {type: "Friend", id: `PENDING_${direction.toUpperCase()}`},
      ],
    }),
    sendFriendRequest: builder.mutation<
      void,
      {senderId: number; receiverId: number}
    >({
      queryFn: async ({senderId, receiverId}) => {
        try {
          await sendFriendRequest(senderId, receiverId);
          return {data: null};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: [{type: "Friend", id: "PENDING_OUTGOING"}],
    }),
    handleFriendRequest: builder.mutation<void, HandleFriendRequestArgs>({
      queryFn: async ({senderId, receiverId, action}) => {
        try {
          await handleFriendshipRequest(senderId, receiverId, action);
          return {data: null};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: [
        {type: "Friend", id: "LIST"},
        {type: "Friend", id: "PENDING_INCOMING"},
        {type: "Friend", id: "PENDING_OUTGOING"},
      ],
    }),
    removeFriend: builder.mutation<void, removeFriendArgs>({
      queryFn: async ({currentUserId, friendId}) => {
        try {
          await removeFriend(currentUserId, friendId);
          return {data: null};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: (result, error, args) => [{type: "Friend", id: "LIST"}],
    }),
    createChallenge: builder.mutation<Challenge, CreateChallengeArgs>({
      queryFn: async ({challengeData, hostId}) => {
        try {
          const newChallenge = await createChallenge(challengeData, hostId);
          return {data: toChallengeForState(newChallenge)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: [{type: "Challenge", id: "LIST"}, {type: "User"}],
    }),
    deleteChallenge: builder.mutation<void, DeleteChallengeArgs>({
      queryFn: async ({challengeId, hostId}) => {
        try {
          await deleteChallenge(challengeId, hostId);
          return {data: null};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: (result, error, args) => [
        {type: "Challenge", id: "LIST"},
        {type: "Challenge", id: "ARCHIVE_LIST"},
        {type: "Challenge", id: args.challengeId},
      ],
    }),
    getChallengeInvites: builder.query<ChallengeInviteDetails[], number>({
      queryFn: async (userId) => {
        try {
          const invites = await getPendingChallengeInvites(userId);
          return {data: toChallengeInvitesForState(invites)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: ["ChallengeInvite"],
    }),
    sendChallengeInvite: builder.mutation<void, SendChallengeInviteArgs>({
      queryFn: async ({challengeId, senderId, receiverId}) => {
        try {
          await sendChallengeInvite(challengeId, senderId, receiverId);
          return {data: null};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: (result, error, args) => [
        {type: "ChallengePendingStatus", id: args.challengeId},
      ],
    }),
    handleChallengeInvite: builder.mutation<void, HandleChallengeInviteArgs>({
      queryFn: async ({challengeId, receiverId, action}) => {
        try {
          await handleChallengeInvite(challengeId, receiverId, action);
          return {data: null};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: (result, error, args) => {
        const tags = [
          "ChallengeInvite",
          {type: "Challenge", id: "LIST"},
          {type: "ChallengePendingStatus", id: args.challengeId},
        ];

        if (args.action === "accept") {
          tags.push("User");
        }
        return tags;
      },
    }),
    getChallengeById: builder.query<
      ChallengeWithMyDetails | null,
      GetChallengeByIdArgs
    >({
      queryFn: async ({challengeId, userId}) => {
        const challenge = await getChallengeById(challengeId, userId);
        if (challenge) {
          return {data: toChallengeForState(challenge)};
        } else {
          return {error: {message: "Challenge not found"}};
        }
      },
      providesTags: (result, error, {challengeId}) => [
        {type: "Challenge", id: challengeId},
      ],
    }),
    getChallengePendingStatus: builder.query<PendingParticipant[], number>({
      queryFn: async (challengeId) => {
        try {
          const data = await getChallengePendingStatus(challengeId);
          return {data};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: (result, error, challengeId) => [
        {type: "ChallengePendingStatus", id: challengeId},
      ],
    }),
    getFeedChallenges: builder.query<ChallengeWithMyDetails[], number>({
      queryFn: async (userId) => {
        try {
          const challenges = await getFeedChallenges(userId);
          return {data: toChallengesForState(challenges)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({id}) => ({type: "Challenge" as const, id})),
              {type: "Challenge", id: "LIST"},
            ]
          : [{type: "Challenge", id: "LIST"}],
    }),
    getArchivedChallenges: builder.query<ChallengeWithMyDetails[], number>({
      queryFn: async (userId) => {
        try {
          const challenges = await getAcrhivedChallenges(userId);
          return {data: toChallengesForState(challenges)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({id}) => ({type: "Challenge" as const, id})),
              {type: "Challenge", id: "ARCHIVE_LIST"},
            ]
          : [{type: "Challenge", id: "ARCHIVE_LIST"}],
    }),
    getChallengeParticipants: builder.query<
      ChallengeParticipantDetails[],
      number
    >({
      // Перший тип - що повертає (масив учасників), другий - що приймає (ID челенджу)
      queryFn: async (challengeId) => {
        try {
          const participants = await getParticipantsByChallengeId(challengeId);
          // Тут не потрібна функція-маппер `to...ForState`, бо дані вже в потрібному форматі
          return {data: participants};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      // Надаємо тег, щоб кеш знав, з якими даними він працює
      // Це корисно, якщо в майбутньому знадобиться оновлювати список учасників
      providesTags: (result, error, challengeId) => [
        {type: "Participant", id: `LIST-${challengeId}`},
      ],
    }),
    getGroupedChallenges: builder.query<GroupedChallenge[], number>({
      queryFn: async (userId) => {
        try {
          const groupedChallenges = await getGroupedActiveChallenges(userId);
          return {data: groupedChallenges};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      providesTags: (result) => [{type: "Challenge", id: "LIST"}],
    }),
    addProgress: builder.mutation<
      {success: boolean; updatedUser: UserForState},
      AddProgressArgs
    >({
      queryFn: async (args) => {
        try {
          const result = await addProgressToChallenges(
            args.userId,
            args.challengeIds,
            args.secondsToAdd,
          );
          return {
            data: {...result, updatedUser: toUserForState(result.updatedUser)},
          };
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: (result, error, args) => [
        {type: "Leaderboard"},
        {type: "Challenge", id: "LIST"},
        ...args.challengeIds.map((id) => ({type: "Challenge" as const, id})),
        ...args.challengeIds.map((id) => ({
          type: "Participant" as const,
          id: `LIST-${id}`,
        })),
      ],
    }),
    triggerStatusUpdate: builder.mutation<TriggerUpdateResult, void>({
      queryFn: async () => {
        try {
          const challengeResult = await updateChallengeStatuses();
          const progressResult = await resetUserProgressIfNeeded();
          return {
            data: {
              updatedChallengesCount: challengeResult.updateCount,
              dailyProgressResets: progressResult.dailyResets,
              weeklyProgressResets: progressResult.weeklyResets,
            },
          };
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: [
        {type: "Challenge", id: "LIST"},
        {type: "User"},
        {type: "Leaderboard"},
      ],
    }),
    markAsViewed: builder.mutation<void, MarkAsViewedArgs>({
      queryFn: async ({userId, challengeId}) => {
        try {
          await markChallengeAsViewed(userId, challengeId);
          return {data: null};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: [{type: "Challenge", id: "LIST"}],
    }),
  }),
});
export const {
  useSignInMutation,
  useSignUpMutation,
  useUpdateUserProfileMutation,
  useUpdateUserDailyGoalMutation,
  useGetUserByIdQuery,
  useFindUsersQuery,
  useLazyFindUsersQuery,
  useGetLeaderboardQuery,
  useGetFriendsQuery,
  useGetPendingFriendRequestsQuery,
  useSendFriendRequestMutation,
  useHandleFriendRequestMutation,
  useRemoveFriendMutation,
  useCreateChallengeMutation,
  useDeleteChallengeMutation,
  useGetChallengeInvitesQuery,
  useSendChallengeInviteMutation,
  useHandleChallengeInviteMutation,
  useGetChallengeByIdQuery,
  useGetFeedChallengesQuery,
  useGetArchivedChallengesQuery,
  useGetChallengeParticipantsQuery,
  useGetGroupedChallengesQuery,
  useAddProgressMutation,
  useTriggerStatusUpdateMutation,
  useMarkAsViewedMutation,
  useGetChallengePendingStatusQuery,
} = apiSlice;
