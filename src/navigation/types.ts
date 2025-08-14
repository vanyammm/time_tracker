import type {StackScreenProps} from "@react-navigation/stack";
import {OnboardingStackParamList} from "./OnboardingNavigator";
import {NavigatorScreenParams} from "@react-navigation/native";
import {ChallengeCreationStackParamList} from "./ChallengeCreationNavigator";
import {SettingsStackParamList} from "./SettingsNavigator";

export type RootStackParamList = {
  ResolveAuth: undefined;
  OnboardingFlow: undefined;
  MainApp: NavigatorScreenParams<MainTabParamList>;
  ChallengeDetails: {challengeId: number};
  ChallengeResult: {challengeId: number};
  ChallengeArchive: undefined;
  ChallengeCreation: NavigatorScreenParams<ChallengeCreationStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
  Auth: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type OnboardingButtonConfig = {
  showNext?: boolean;
  nextText?: string;
  showSkip?: boolean;
};

export type OnboardingScreenConfig = {
  name: string;
  component: React.ComponentType<any>;
  buttons: OnboardingButtonConfig;
};

export interface OnboardingScreenCustomProps {
  onNext: () => void;
}

export type OnboardingScreenComponentProps = StackScreenProps<
  OnboardingStackParamList,
  any
> & {
  onNext: () => void;
};

export type MainTabParamList = {
  Statistics: undefined;
  Activity: undefined;
  Friendship: undefined;
};
