export interface ChallengeData {
  action: string;
  type: "Regular" | "Streak" | "Race" | "Team";
  hoursAmount: number;
  daysAmount?: number;
}
