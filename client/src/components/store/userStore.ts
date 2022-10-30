import create from "zustand";
import { UpdateProfileSuccess, UserSignInSuccess } from "../../types/User";

type State = {
  currentUser: UserSignInSuccess;
};

type Action = {
  setUser: (user: UserSignInSuccess) => void;
  removeUser: () => void;
  updateUser: (user: UserSignInSuccess) => void;
};

export const useStore = create<State & Action>()((set) => ({
  currentUser: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  setUser: (user: UserSignInSuccess) => set(() => ({ currentUser: user })),
  removeUser: () => set(() => ({ currentUser: null })),
  updateUser: (user: UserSignInSuccess) => {
    set(() => ({ currentUser: user }));
  },
}));

// setUser: (user: UserSignInSuccess) => set({ user }),
