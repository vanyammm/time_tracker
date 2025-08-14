import type {
  ChallengeStatus,
  ChallengeWithMyDetails,
  User,
} from "../../db/schema";
import type {UserForState} from "../store/api/apiSlice";

export function toUserForState(user: User): UserForState {
  return {
    ...user,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
    lastProgressUpdate: user.lastProgressUpdate
      ? user.lastProgressUpdate instanceof Date
        ? user.lastProgressUpdate.toISOString()
        : String(user.lastProgressUpdate)
      : null,
  };
}
import {ChallengeData} from "../types";

export const formatDate = (date: Date | string) => {
  console.log(`[utils.js | formatDate()] date:${date}`);
  const dateObj = date instanceof Date ? date : new Date(date);

  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", {month: "short"});
  const year = dateObj.getFullYear();

  const formattedDate = `${day < 10 ? "0" + day : day} ${month} ${year}`;

  console.log(`formattedDate: ${formattedDate}`);

  return formattedDate;
};

export const getCurrentFormattedDate = () => {
  const currentDate = new Date();
  return formatDate(currentDate);
};

export const generateChallengeDescriptionString = ({
  action,
  type,
  hoursAmount,
  daysAmount,
}: ChallengeData): string => {
  let output = "";
  switch (type) {
    case "regular":
      output = `${action} a total of ${hoursAmount} hours in ${daysAmount} days.`;
      break;
    case "race":
      output = `${action} Race to ${hoursAmount}h.`;
      break;
    case "streak":
      output = `${action} for ${hoursAmount} hours daily for ${daysAmount} consecutive days.`;
      break;
    case "team":
      output = `Collectively ${action} a total of ${hoursAmount} hours in ${daysAmount} days.`;
  }
  return output;
};

import type {Challenge} from "../../db/schema";
import {current} from "@reduxjs/toolkit";
import {ChallengeInviteDetails} from "../services/challengeService";
export function toChallengeForState<T extends Challenge>(
  challenge: T,
): Omit<T, "startDate"> & {startDate: string} {
  return {
    ...challenge,
    startDate:
      challenge.startDate instanceof Date
        ? challenge.startDate.toISOString()
        : String(challenge.startDate),
    endDate:
      challenge.endDate &&
      (challenge.endDate instanceof Date
        ? challenge.endDate.toISOString()
        : String(challenge.endDate)),
  };
}

export function toChallengesForState<T extends Challenge>(
  challenges: T[],
): (Omit<T, "startDate"> & {startDate: string})[] {
  return challenges.map(toChallengeForState);
}

export const formatProgressTime = (
  seconds: number,
  mode: "compact" | "detailed" = "compact",
): string => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return "0s";
  }

  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600;

  if (mode === "detailed") {
    if (seconds < SECONDS_IN_MINUTE) {
      return `${Math.floor(seconds)}s`;
    }

    if (seconds < SECONDS_IN_HOUR) {
      const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
      const remainingSeconds = Math.floor(seconds % SECONDS_IN_MINUTE);

      if (!remainingSeconds) {
        return `${minutes}m`;
      }

      return `${minutes}m ${remainingSeconds}s`;
    }

    const hours = Math.floor(seconds / SECONDS_IN_HOUR);
    const remainingMinutes = Math.floor(
      (seconds & SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
    );

    if (!remainingMinutes) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  if (seconds < SECONDS_IN_MINUTE) {
    return `${Math.floor(seconds)}s`;
  }

  if (seconds < SECONDS_IN_HOUR) {
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    return `${minutes}m`;
  }

  const hours = seconds / SECONDS_IN_HOUR;

  const formattedHours = hours.toFixed(1).replace(/\.0$/, "");

  return `${formattedHours}h`;
};

export const calculateProgressRatio = (
  progressInSeconds: number,
  goalInHours: number,
): number => {
  if (
    typeof progressInSeconds !== "number" ||
    typeof goalInHours !== "number"
  ) {
    return 0;
  }

  if (goalInHours <= 0) {
    return 1;
  }

  const goalInSeconds = goalInHours * 3600;

  const ratio = progressInSeconds / goalInSeconds;

  return Math.max(0, Math.min(1, ratio));
};

export const calculateStreakStats = (
  dailyStreakProgress: number[],
  hoursAmount: number,
  daysPassed: number,
): {wonDays: number; lostDays: number} => {
  if (!dailyStreakProgress || !hoursAmount || !daysPassed) {
    return {wonDays: 0, lostDays: 0};
  }

  const dailyGoalInSeconds = hoursAmount * 3600;

  let wonDays = 0;
  let lostDays = 0;

  for (let i = 0; i < daysPassed - 1; i++) {
    if (i >= dailyStreakProgress.length) {
      break;
    }

    const dayProgress = dailyStreakProgress[i] || 0;

    if (dayProgress >= dailyGoalInSeconds) {
      wonDays++;
    } else {
      lostDays++;
    }
  }

  const todayIndex = daysPassed - 1;
  if (todayIndex < dailyStreakProgress.length) {
    const todayProgress = dailyStreakProgress[todayIndex] || 0;

    if (todayProgress >= dailyGoalInSeconds) {
      wonDays++;
    }
  }

  return {wonDays, lostDays};
};

export const calculateDaysPassed = (startDate: Date | string) => {
  const today = new Date();
  const startDateObj =
    startDate instanceof Date ? startDate : new Date(startDate);
  const daysPassed =
    Math.floor(
      (today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

  return daysPassed;
};

export type ChallengeInviteForState = Omit<
  ChallengeInviteDetails,
  "startDate"
> & {
  startDate: string;
};

export const toChallengeInviteForState = (
  invite: ChallengeInviteDetails,
): ChallengeInviteForState => {
  return {
    ...invite,
    startDate:
      invite.startDate instanceof Date
        ? invite.startDate.toISOString()
        : String(invite.startDate),
  };
};

export const toChallengeInvitesForState = (
  invites: ChallengeInviteDetails[],
): ChallengeInviteForState[] => {
  return invites.map(toChallengeInviteForState);
};

export const calculateTimeBeforeStart = (
  startDate: Date | string,
  status: ChallengeStatus,
): number | null => {
  if (status !== "pending") {
    return null;
  }

  const startDateObj =
    startDate instanceof Date ? startDate : new Date(startDate);

  const now = new Date().getTime();
  const startTime = startDateObj.getTime();
  const timeDifference = startTime - now;

  if (timeDifference <= 0) {
    return null;
  }

  return Math.floor(timeDifference / 1000);
};

export const formatTimeFromDate = (dateInput: Date | string): string => {
  const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};
