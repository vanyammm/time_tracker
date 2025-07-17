import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {signIn, signUp} from "../../services/authService";
import type {
  User,
  Challenge,
  ChallengeParticipantDetails,
  GroupedChallenge,
} from "../../../db/schema";
import {
  toChallengeForState,
  toChallengesForState,
  toUserForState,
} from "../../utils/utils";
import type {RegistrationData} from "../../context/OnboardingContext";
import {
  ChallengeCreationData,
  createChallenge,
  getChallengeById,
  getChallengesByUserId,
  getParticipantsByChallengeId,
  getGroupedActiveChallenges,
  addProgressToChallenges,
  updateChallengeStatuses,
} from "../../services/challengeService";
import {QueryBuilder} from "drizzle-orm/gel-core";

export type UserForState = Omit<User, "createdAt"> & {
  createdAt: string;
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

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "Challenge", "Participant"],
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
    createChallenge: builder.mutation<Challenge, CreateChallengeArgs>({
      queryFn: async ({challengeData, hostId}) => {
        try {
          const newChallenge = await createChallenge(challengeData, hostId);
          return {data: toChallengeForState(newChallenge)};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: [{type: "Challenge", id: "LIST"}],
    }),
    getChallengeById: builder.query<Challenge | null, number>({
      queryFn: async (id) => {
        const challenge = await getChallengeById(id);
        if (challenge) {
          return {data: toChallengeForState(challenge)};
        } else {
          return {error: {message: "Challenge not found"}};
        }
      },
      providesTags: (result, error, id) => [{type: "Challenge", id}],
    }),
    getChallenges: builder.query<Challenge[], number>({
      queryFn: async (userId) => {
        try {
          const challenges = await getChallengesByUserId(userId);
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
    addProgress: builder.mutation<{success: boolean}, AddProgressArgs>({
      queryFn: async (args) => {
        try {
          await addProgressToChallenges(
            args.userId,
            args.challengeIds,
            args.secondsToAdd,
          );
          return {data: {success: true}};
        } catch (error: any) {
          return {error: {message: error.message}};
        }
      },
      invalidatesTags: (result, error, args) =>
        args.challengeIds.map((id) => ({
          type: "Participant",
          id: `LIST-${id}`,
        })),
    }),
    triggerStatusUpdate: builder.mutation<{updatedCount: number}, void>({
      queryFn: async () => {
        try {
          const result = await updateChallengeStatuses();
          return {data: result};
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
  useCreateChallengeMutation,
  useGetChallengeByIdQuery,
  useGetChallengesQuery,
  useGetChallengeParticipantsQuery,
  useGetGroupedChallengesQuery,
  useAddProgressMutation,
  useTriggerStatusUpdateMutation,
} = apiSlice;
