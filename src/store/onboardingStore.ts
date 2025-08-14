import {create} from "zustand";
import {User} from "../../db/schema";

export type RegistrationData = {
  username?: string;
  password?: string;
  avatarGradient?: string[];
  dailyGoalMinutes?: number;
};

interface OnboardingState {
  registrationData: RegistrationData;
  isNextStepAllowed: boolean;
  createdChallengeId: number | null;
  actions: {
    updateRegistrationData: (data: Partial<RegistrationData>) => void;
    setIsNextStepAllowed: (isAllowed: boolean) => void;
    setCreatedChallengeId: (id: number | null) => void;
    reset: () => void;
  };
}

const initialState = {
  registrationData: {
    avatarGradient: ["#ff7e5f", "#feb47b"],
    dailyGoalMinutes: 45,
  },
  isNextStepAllowed: true,
  createdChallengeId: null,
  currentUser: null,
};

const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  actions: {
    updateRegistrationData: (data) =>
      set((state) => ({
        registrationData: {...state.registrationData, ...data},
      })),
    setIsNextStepAllowed: (isAllowed) => set({isNextStepAllowed: isAllowed}),
    setCreatedChallengeId: (id) => set({createdChallengeId: id}),
    reset: () => set(initialState),
  },
}));

export const useOnboardingState = () => useOnboardingStore((state) => state);
export const useOnboardingActions = () =>
  useOnboardingStore((state) => state.actions);

export default useOnboardingStore;
