import create from 'zustand';

interface TopBar {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  displayName: string;
  setUpdatedDisplayName: (name: string) => void;
}

export const useTopbarStore = create<TopBar>((set) => ({
  avatarUrl: "",
  displayName:"",
  setAvatarUrl: (url: string) => {
    set({ avatarUrl: url });
  },
  setUpdatedDisplayName: (name: string) => {
    set({ displayName: name });
  },
}));