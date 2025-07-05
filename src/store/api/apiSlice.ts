import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {signIn, signUp} from "../../services/authService";
import type {User, Challenge} from "../../../db/schema";
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
} from "../../services/challengeService";
import {QueryBuilder} from "drizzle-orm/gel-core";

export type UserForState = Omit<User, "createdAt"> & {
  createdAt: string;
};

interface CreateChallengeArgs {
  challengeData: ChallengeCreationData;
  hostId: number;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "Challenge"],
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
      invalidatesTags: ["Challenge"],
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
  }),
});
export const {
  useSignInMutation,
  useSignUpMutation,
  useCreateChallengeMutation,
  useGetChallengeByIdQuery,
  useGetChallengesQuery,
} = apiSlice;
