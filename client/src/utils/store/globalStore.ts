import create from "zustand";
import { Profile } from "../../types/User";

type State = {
  currentUser: Profile;
};

type Action = {
  setUser: (user: Profile) => void;
  removeUser: () => void;
  updateUser: (user: Profile) => void;
};

export const useStore = create<State & Action>()((set) => ({
  currentUser: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  setUser: (user: Profile) => set(() => ({ currentUser: user })),
  removeUser: () => set(() => ({ currentUser: null })),
  updateUser: (user: Profile) => {
    // TODO needs type fixing coz no work!
    set(() => ({ currentUser: user }));
  },
}));

type tagState = {
  filterTag: string;
};
type TagAction = {
  updateTag: (tag: string) => void;
  clearTag(): void;
};

export const useTagStore = create<tagState & TagAction>()((set) => ({
  filterTag: JSON.parse(localStorage.getItem("tag"))
    ? JSON.parse(localStorage.getItem("tag")!)
    : null,
  updateTag: (tag: string) => {
    set(() => ({ filterTag: tag }));
  },
  clearTag: () => {
    set(() => ({ filterTag: null }));
  },
}));

type paginationState = {
  page: number;
};

type paginationAction = {
  updatePage: (page: number) => void;
};

export const usePaginationStore = create<paginationState & paginationAction>()(
  (set) => ({
    page: 1,
    updatePage: (page: number) => {
      set(() => ({ page: page }));
    },
  })
);

type isFileUpload = {
  isFileUpload: boolean;
};
type isFileUploadAction = {
  updateIsFileUpload: (isFileUpload: boolean) => void;
};

export const useIsFileUploadStore = create<isFileUpload & isFileUploadAction>()(
  (set) => ({
    isFileUpload: false,
    updateIsFileUpload: (isFileUpload: boolean) => {
      set(() => ({ isFileUpload: isFileUpload }));
    },
  })
);
