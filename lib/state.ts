import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  userName: string | null;
  namespaceID: string | null;
  submissionId: number | null;
  setUserName: (userName: string) => void;
  setParametersForSimilarity: (
    namespaceID: string,
    submissionId: number
  ) => void;
};

export const useUserState = create<State>()(
  persist(
    (set) => ({
      userName: null,
      namespaceID: null,
      submissionId: null,
      setUserName: (userName) => set({ userName }),
      setParametersForSimilarity: (namespaceID, submissionId) =>
        set({ namespaceID, submissionId }),
    }),
    {
      name: "auth-storage",
    }
  )
);
