import { create } from 'zustand';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, ACCOUNT_TYPE, ROLE } from '@/shared/constants/storage';

interface UserInfoState {
  accessToken: string | null;
  accountType: string | null;
  id: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  username: string | null;
  isFirstLogin: boolean | null;
  role: string | null;
  canShowSnackbar: boolean | null;
  setUserInfo: (userInfo: Partial<UserInfoState>) => void;
  clearUserInfo: () => void;
}

export const useLoginUserInfo = create<UserInfoState>((set) => ({
  accessToken: Cookies.get(ACCESS_TOKEN) || null,
  accountType: Cookies.get(ACCOUNT_TYPE) || null,
  role: Cookies.get(ROLE) || null,
  id: null,
  displayName: null,
  avatarUrl: null,
  username: null,
  isFirstLogin: false,
  canShowSnackbar: false,

  setUserInfo: (userInfo: Partial<UserInfoState>) => {
    const { accessToken, accountType, role, ...restUserInfo } = userInfo;

    if (accessToken) Cookies.set(ACCESS_TOKEN, accessToken);
    if (accountType) Cookies.set(ACCOUNT_TYPE, accountType);
    if (role) Cookies.set(ROLE, role);

    set((state) => ({
      ...state,
      ...restUserInfo,
      accessToken: accessToken || state.accessToken,
      accountType: accountType || state.accountType,
      role: role || state.role,
    }));
  },

  clearUserInfo: () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(ACCOUNT_TYPE);
    Cookies.remove(ROLE);

    set({
      accessToken: null,
      accountType: null,
      role: null,
      id: null,
      displayName: null,
      avatarUrl: null,
      username: null,
      isFirstLogin: null,
      canShowSnackbar: null
    });
  },
}));