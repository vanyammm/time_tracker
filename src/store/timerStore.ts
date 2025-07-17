import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getUserById} from "../services/authService";
import {useUserStore} from "./userStore";

const TIMER_DURATION_KEY = "@timer_duration_seconds";

type TimerStatus = "idle" | "running" | "paused";

interface TimerState {
  status: TimerStatus;
  durationSeconds: number;
  remainingSeconds: number;
  actions: {
    init: () => Promise<void>;
    setDuration: (seconds: number) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: () => number;
    _tick: () => void;
  };
}

let timerInterval: NodeJS.Timeout | null = null;
let startTime = 0;
let pauseTime = 0;

export const useTimerStore = create<TimerState>((set, get) => ({
  status: "idle",
  durationSeconds: 45 * 60,
  remainingSeconds: 45 * 60,
  actions: {
    init: async () => {
      try {
        const savedDuration = await AsyncStorage.getItem(TIMER_DURATION_KEY);
        if (savedDuration) {
          const duration = parseInt(savedDuration, 10);
          console.log("fetched timer duration from async storage:", duration);
          get().actions.setDuration(duration);
          return;
        }

        const currentUserId = useUserStore.getState().user?.id;
        if (currentUserId) {
          const user = await getUserById(currentUserId);
          if (user && user.dailyGoalMinutes) {
            const duration = user.dailyGoalMinutes * 60;
            console.log(
              "no data in async storage, took data from DB:",
              duration,
            );
            get().actions.setDuration(duration);
            await AsyncStorage.setItem(TIMER_DURATION_KEY, String(duration));
            return;
          }
        }
        console.log("nothing found, using default duration value (45m)");
      } catch (error: any) {
        console.log("init timer state error", error);
      }
    },
    setDuration: (seconds) => {
      if (get().status === "idle") {
        set({durationSeconds: seconds, remainingSeconds: seconds});

        AsyncStorage.setItem(TIMER_DURATION_KEY, String(seconds)).catch((e) =>
          console.log("error save new timer duration value:", e),
        );
      }
    },
    startTimer: () => {
      if (get().status !== "idle") return;
      startTime = Date.now();
      set({status: "running"});
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => get().actions._tick(), 1000);
    },
    pauseTimer: () => {
      if (get().status !== "running" || !timerInterval) return;
      clearInterval(timerInterval);
      timerInterval = null;
      pauseTime = Date.now();
      set({status: "paused"});
    },
    resumeTimer: () => {
      if (get().status !== "paused") return;
      const pauseDuration = Date.now() - pauseTime;
      startTime += pauseDuration;
      set({status: "running"});
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => get().actions._tick(), 1000);
    },
    stopTimer: () => {
      const {durationSeconds, remainingSeconds, status} = get();

      if (status === "idle") {
        return 0;
      }

      const elapsedSeconds = durationSeconds - remainingSeconds;

      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      set({status: "idle", remainingSeconds: get().durationSeconds});

      console.log("timer stopped, time elapsed:", elapsedSeconds, "s");
      return Math.max(0, elapsedSeconds);
    },
    _tick: () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newRemaining = get().durationSeconds - elapsed;
      if (newRemaining <= 0) {
        get().actions.stopTimer();
      } else {
        set({remainingSeconds: newRemaining});
      }
    },
  },
}));

useTimerStore.getState().actions.init();

export const useTimerActions = () => useTimerStore((state) => state.actions);
