import type {User} from "../../db/schema";
import type {UserForState} from "../store/api/apiSlice";

export function toUserForState(user: User): UserForState {
  return {
    ...user,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}
// import {ChallengeData} from "../context/OnboardingContext";
import {ChallengeData} from "../types";

export const getCurrentFormattedDate = () => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", {month: "short"});
  const year = currentDate.getFullYear();

  const formattedDate = `${day < 10 ? "0" + day : day} ${month} ${year}`;

  return formattedDate;
};

export const generateChallengeDescriptionString = ({
  action,
  type,
  hoursAmount,
  daysAmount,
}: ChallengeData): string => {
  let output = "";
  switch (type) {
    case "Regular":
      output = `${action} a total of ${hoursAmount} hours in ${daysAmount} days.`;
      break;
    case "Race":
      output = `Be first to ${action} a total of ${hoursAmount} hours.`;
      break;
    case "Streak":
      output = `${action} for ${hoursAmount} hours daily for ${daysAmount} consecutive days.`;
      break;
    case "Team":
      output = `Collectively ${action} a total of ${hoursAmount} hours in ${daysAmount} days.`;
  }
  return output;
};

import type {Challenge} from "../../db/schema";
export function toChallengeForState(
  challenge: Challenge,
): Omit<Challenge, "startDate"> & {startDate: string} {
  return {
    ...challenge,
    startDate:
      challenge.startDate instanceof Date
        ? challenge.startDate.toISOString()
        : String(challenge.startDate),
  };
}

export function toChallengesForState(
  challenges: Challenge[],
): (Omit<Challenge, "startDate"> & {startDate: string})[] {
  return challenges.map(toChallengeForState);
}

export const formatProgressTime = (seconds: number): string => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return "0s";
  }

  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 3600;

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
