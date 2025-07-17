import "react-native-gesture-handler";
import {enableScreens} from "react-native-screens";
enableScreens();
import {Suspense, useEffect} from "react";
import {
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {SQLiteProvider, openDatabaseSync} from "expo-sqlite";
import {useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./drizzle/migrations";

import {RootNavigator} from "./src/navigation/RootNavigator";
import {NavigationContainer} from "@react-navigation/native";
import {COLORS} from "./src/theme/colors";
import {DATABASE_NAME} from "./src/constants";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {db} from "./src/db";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {Provider} from "react-redux";
import {store} from "./src/store/store";

import {useTriggerStatusUpdateMutation} from "./src/store/api/apiSlice";
import {AppContent} from "./src/AppContent";

const resetOnboarding = async () => {
  try {
    console.log("!!!!!!!!!!!!!! RESETTING ONBOARDING STATUS !!!!!!!!!!!!!!");
    await AsyncStorage.removeItem("@onboarding_completed");
  } catch (e) {
    console.error("Failed to reset onboarding status", e);
  }
};
// resetOnboarding();

export default function App() {
  const {success, error} = useMigrations(db, migrations);

  return (
    <Provider store={store}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{enableChangeListener: true}}
          useSuspense
        >
          <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={{flex: 1, backgroundColor: COLORS.darkBlue}}>
              {/* <NavigationContainer>
                <RootNavigator />
              </NavigationContainer> */}
              <AppContent />
            </SafeAreaView>
          </GestureHandlerRootView>
        </SQLiteProvider>
      </Suspense>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
