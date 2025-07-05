import React, {createContext, ReactNode, useContext, useState} from "react";
import {NewUser, User} from "../../db/schema";

export type RegistrationData = Partial<NewUser> & {
  password?: string;
};

type OnboardingContextType = {
  createdChallengeId: number | null;
  setCreatedChallengeId: (id: number | null) => void;
  gradient: string[] | null;
  setGradient: (data: string[] | null) => void;
  registrationData: RegistrationData;
  setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationData>>;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  dailyGoalMinutes: string | null;
  setDailyGoalMinutes: (data: string | null) => void;
  isNextStepAllowed: boolean;
  setIsNextStepAllowed: (isAllowed: boolean) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboardingData = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingData must be used within an OnboardingProvider",
    );
  }
  return context;
};

export const OnboardingDataProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [createdChallengeId, setCreatedChallengeId] = useState<number | null>(
    null,
  );
  const [gradient, setGradient] = useState<string[] | null>(null);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData>(
    {},
  );
  console.log("reg data", registrationData);
  console.log("context: gradient value", gradient);
  console.log("context: dailyGoalMinutes value", dailyGoalMinutes);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isNextStepAllowed, setIsNextStepAllowed] = useState(true);

  // console.log("isnextstepallowed", isNextStepAllowed);

  const value = {
    createdChallengeId,
    setCreatedChallengeId,
    gradient,
    setGradient,
    dailyGoalMinutes,
    setDailyGoalMinutes,
    registrationData,
    setRegistrationData,
    currentUser,
    setCurrentUser,
    isNextStepAllowed,
    setIsNextStepAllowed,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
