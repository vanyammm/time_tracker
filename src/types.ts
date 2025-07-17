export interface ChallengeData {
  action: string;
  type: "regular" | "streak" | "race" | "team";
  hoursAmount: number;
  daysAmount?: number;
}
