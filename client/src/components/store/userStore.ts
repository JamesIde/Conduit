import create from "zustand";
import { UserSignInSuccess } from "../../types/User";

type State = {
  currentUser: UserSignInSuccess;
};

type Action = {
  setUser: (user: UserSignInSuccess) => void;
};

export const useStore = create<State & Action>()((set) => ({
  currentUser: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  setUser: (user: UserSignInSuccess) => set(() => ({ currentUser: user })),
}));

// setUser: (user: UserSignInSuccess) => set({ user }),
