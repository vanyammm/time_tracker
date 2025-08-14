import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getUserById} from "../services/authService";
import {useUserStore} from "./userStore";

const TIMER_DURATION_KEY = "@timer_duration_seconds";

type TimerStatus = "idle" | "running" | "paused";

interface TimerState {
  status: TimerStatus;
  initialDurationSeconds: number;
  currentDurationSeconds: number;
  remainingSeconds: number;
  actions: {
    init: () => Promise<void>;
    setDuration: (seconds: number) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: () => number;
    adjustTime: (minutes: number) => void;
    _tick: () => void;
  };
}

let timerInterval: NodeJS.Timeout | null = null;
let startTime = 0;
let totalElapsedAtPause = 0;

export const useTimerStore = create<TimerState>((set, get) => ({
  status: "idle",
  initialDurationSeconds: 45 * 60,
  currentDurationSeconds: 45 * 60,
  remainingSeconds: 45 * 60,
  actions: {
    init: async () => {
      try {
        const savedDuration = await AsyncStorage.getItem(TIMER_DURATION_KEY);
        if (savedDuration) {
          const duration = parseInt(savedDuration, 10);
          set({
            initialDurationSeconds: duration,
            currentDurationSeconds: duration,
            remainingSeconds: duration,
          });
          return;
        }
        const currentUserId = useUserStore.getState().user?.id;
        if (currentUserId) {
          const user = await getUserById(currentUserId);
          if (user && user.dailyGoalMinutes) {
            const duration = user.dailyGoalMinutes * 60;
            set({
              initialDurationSeconds: duration,
              currentDurationSeconds: duration,
              remainingSeconds: duration,
            });
            await AsyncStorage.setItem(TIMER_DURATION_KEY, String(duration));
            return;
          }
        }
      } catch (error: any) {
        console.log("init timer state error", error);
      }
    },
    setDuration: (seconds) => {
      if (get().status === "idle") {
        set({
          initialDurationSeconds: seconds,
          currentDurationSeconds: seconds,
          remainingSeconds: seconds,
        });
        AsyncStorage.setItem(TIMER_DURATION_KEY, String(seconds)).catch(
          console.error,
        );
      }
    },
    startTimer: () => {
      if (get().status !== "idle") return;
      startTime = Date.now();
      totalElapsedAtPause = 0;
      set((state) => ({
        status: "running",

        currentDurationSeconds: state.initialDurationSeconds,
        remainingSeconds: state.initialDurationSeconds,
      }));
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => get().actions._tick(), 1000);
    },
    pauseTimer: () => {
      if (get().status !== "running" || !timerInterval) return;
      clearInterval(timerInterval);
      timerInterval = null;
      totalElapsedAtPause += Date.now() - startTime;
      set({status: "paused"});
    },
    resumeTimer: () => {
      if (get().status !== "paused") return;
      startTime = Date.now();
      set({status: "running"});
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => get().actions._tick(), 1000);
    },
    adjustTime: (minutes) => {
      const {status} = get();
      if (status !== "running" && status !== "paused") return;
      const secondsToAdd = minutes * 60;
      set((state) => {
        const newRemaining = Math.max(0, state.remainingSeconds + secondsToAdd);
        const newDuration = Math.max(
          0,
          state.currentDurationSeconds + secondsToAdd,
        );
        return {
          remainingSeconds: newRemaining,
          currentDurationSeconds: newDuration,
        };
      });
    },
    stopTimer: () => {
      const {status, initialDurationSeconds} = get();
      if (status === "idle") return 0;

      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;

      let finalElapsedMs = totalElapsedAtPause;
      if (status === "running") {
        finalElapsedMs += Date.now() - startTime;
      }

      const finalElapsedSeconds = Math.floor(finalElapsedMs / 1000);

      set({
        status: "idle",
        remainingSeconds: initialDurationSeconds,
        currentDurationSeconds: initialDurationSeconds,
      });
      totalElapsedAtPause = 0;

      console.log("timer stopped, time elapsed:", finalElapsedSeconds, "s");
      return Math.max(0, finalElapsedSeconds);
    },
    _tick: () => {
      const elapsedSinceResume = Date.now() - startTime;
      const totalElapsedMs = totalElapsedAtPause + elapsedSinceResume;
      const newRemaining =
        get().currentDurationSeconds - Math.floor(totalElapsedMs / 1000);

      if (newRemaining <= 0) {
        set({remainingSeconds: 0});
        get().actions.stopTimer();
      } else {
        set({remainingSeconds: newRemaining});
      }
    },
  },
}));

useTimerStore.getState().actions.init();
export const useTimerActions = () => useTimerStore((state) => state.actions);
