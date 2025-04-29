import { User } from "@supabase/supabase-js";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
