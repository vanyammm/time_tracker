import {create} from "zustand";
import type {Friend} from "../services/friendshipService";

interface ChallengeCreationState {
  selectedFriends: Friend[];
  setSelectedFriends: (friends: Friend[]) => void;
  toggleFriend: (friend: Friend) => void;
  clear: () => void;
}

export const useChallengeCreationStore = create<ChallengeCreationState>(
  (set) => ({
    selectedFriends: [],
    setSelectedFriends: (friends) => set({selectedFriends: friends}),
    toggleFriend: (friend) =>
      set((state) => {
        const isSelected = state.selectedFriends.some(
          (f) => f.id === friend.id,
        );
        if (isSelected) {
          return {
            selectedFriends: state.selectedFriends.filter(
              (f) => f.id !== friend.id,
            ),
          };
        } else {
          return {selectedFriends: [...state.selectedFriends, friend]};
        }
      }),
    clear: () => set({selectedFriends: []}),
  }),
);
