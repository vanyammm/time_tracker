import type {StackScreenProps} from "@react-navigation/stack";
import {OnboardingStackParamList} from "./OnboardingNavigator";

export type RootStackParamList = {
  ResolveAuth: undefined;
  OnboardingFlow: undefined;
  MainApp: undefined;
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
