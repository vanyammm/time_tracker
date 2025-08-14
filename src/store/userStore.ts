import {create} from "zustand";
import type {User} from "../../db/schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {UserForState} from "./api/apiSlice";
import {toUserForState} from "../utils/utils";
import {getUserById} from "../services/authService";

const USER_ID_KEY = "@auth_user_id";

interface UserState {
  user: UserForState | null;
  setUser: (user: User | UserForState | null) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => {
    if (user) {
      if (user.createdAt instanceof Date) {
        set({user: toUserForState(user as User)});
      } else {
        set({user: user as UserForState});
      }
      AsyncStorage.setItem(USER_ID_KEY, String(user.id));
    } else {
      set({user: null});
      AsyncStorage.removeItem(USER_ID_KEY);
    }
  },
  logout: () => {
    set({user: null});
    AsyncStorage.removeItem(USER_ID_KEY);
  },
  hydrate: async () => {
    try {
      const userIdString = await AsyncStorage.getItem(USER_ID_KEY);
      if (userIdString) {
        const userFromDb = await getUserById(parseInt(userIdString, 10));
        if (userFromDb) {
          set({user: toUserForState(userFromDb)});
        }
        console.log(`User ID ${userIdString} found. Need to fetch from DB.`);
      }
    } catch (e) {
      console.error("Failed to hydrate user state", e);
    }
  },
}));
