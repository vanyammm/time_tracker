import "react-native-gesture-handler";
import {enableScreens} from "react-native-screens";
enableScreens();
import {Suspense, useEffect, useState} from "react";
import {
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
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
import {AppContent} from "./src/AppContent";
import {useUserStore} from "./src/store/userStore";

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await useUserStore.getState().hydrate();
      } catch (e) {
        console.error("Помилка під час підготовки додатку:", e);
      } finally {
        setIsReady(true);
      }
    };
    prepareApp();
  }, []);

  if (error) {
    return (
      <View
        style={{
          backgroundColor: "black",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{color: "red"}}>Migration Error: {error.message}</Text>
      </View>
    );
  }

  if (!success || !isReady) {
    return (
      <View
        style={{
          backgroundColor: "black",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{enableChangeListener: true}}
          useSuspense
        >
          <GestureHandlerRootView style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: COLORS.darkBlue}}>
              <AppContent />
            </View>
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
