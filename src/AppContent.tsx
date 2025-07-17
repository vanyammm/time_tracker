import React, {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {RootNavigator} from "./navigation/RootNavigator";
import {useTriggerStatusUpdateMutation} from "./store/api/apiSlice";

export const AppContent = () => {
  const [triggerUpdate] = useTriggerStatusUpdateMutation();

  useEffect(() => {
    console.log("[AppContent] triggering challenges status check.");
    triggerUpdate();
  }, [triggerUpdate]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};
