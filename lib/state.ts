import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  userName: string | null;
  setUserName: (userName: string) => void;
};

export const useUserState = create<State>()(
  persist(
    (set) => ({
      userName: null,
      setUserName: (userName) => set({ userName }),
    }),
    {
      name: "auth-storage",
    }
  )
);
