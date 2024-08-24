import create from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  isFirstLogin: boolean;
  username: string;
  displayName:string;
  setIsFirstLogin: (isFirstLogin: boolean) => void;
  setUsername: (username: string) => void;
  setDisplayName:(displayName:string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isFirstLogin: true,
      username: '',
      displayName:'',
      setIsFirstLogin: (isFirstLogin) => set({ isFirstLogin }),
      setUsername: (username) => set({ username }),
      setDisplayName:(displayName:string) =>set({displayName})
    }),
    {
      name: 'user-storage',
    }
  )
);