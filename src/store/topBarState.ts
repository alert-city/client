import { create } from 'zustand';

interface TopBarState {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  displayName: string;
  setUpdatedDisplayName: (name: string) => void;
}

export const useTopbarStore = create<TopBarState>((set) => ({
  avatarUrl: '',
  displayName: '',
  setAvatarUrl: (url: string) => {
    set({ avatarUrl: url });
  },
  setUpdatedDisplayName: (name: string) => {
    set({ displayName: name });
  },
}));