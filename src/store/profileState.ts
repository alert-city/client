import { create } from 'zustand';
import { UPDATE_USER } from '@/graphql/user';
import { useMutation } from '@apollo/client';
import React from 'react';
import { USERNAME, ID } from '@/shared/constants/storage';

interface SubmitInput {
  firstName?: string;
  lastName?: string;

  [key: string]: string | boolean | undefined;
}

interface UserInfo {
  displayName: string;
  phoneNumber: string;
  username: string;
  avatarUrl: string;
  name: {
    firstName: string;
    lastName: string;
  };
  is2FAEnabled: boolean;
  orgName: string;
}

interface UserInfoState {
  userInfo: UserInfo;
  isValueChange: BooleanUserInfo;
  isEdit: BooleanUserInfo;
  selectedSection: string;
  setUserInfo: (newUserInfo: Partial<UserInfo>) => void;
  setIsValueChange: (fields: Partial<BooleanUserInfo>) => void;
  setIsEdit: (fields: Partial<BooleanUserInfo>) => void;
  setSelectedSection: (section: string) => void;
  initialUserInfo: UserInfo;
  setInitialUserInfo: (newUserInfo: Partial<UserInfo>) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  storedUsername: string;
  storedId: string;
  setStoredId: (id: string) => void;
  setStoredUsername: (username: string) => void;
  requestError: string;
  setRequestError: (error: string) => void;
  reset: () => void;
  twoFAStatus: boolean;
  setTwoFAStatus: (status: boolean) => void;
  forceUpdate: () => void;
}

const initialUserInfo: UserInfo = {
  displayName: '',
  phoneNumber: '',
  username: '',
  avatarUrl: '',
  name: {
    firstName: '',
    lastName: '',
  },
  is2FAEnabled: false,
  orgName: '',
};

interface BooleanUserInfo {
  displayName: boolean;
  phoneNumber: boolean;
  username: boolean;
  avatarUrl: boolean;
  name: {
    firstName: boolean;
    lastName: boolean;
  };
  is2FAEnabled: boolean;
  orgName: boolean;
}

const initialBooleanState: BooleanUserInfo = {
  displayName: false,
  phoneNumber: false,
  username: false,
  avatarUrl: false,
  name: {
    firstName: false,
    lastName: false,
  },
  is2FAEnabled: false,
  orgName: false,
};

const initialSelectedSection = 'Avatar';
const initialLoading = false;

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: initialUserInfo,
  initialUserInfo: initialUserInfo,
  isValueChange: initialBooleanState,
  isEdit: initialBooleanState,
  selectedSection: initialSelectedSection,
  loading: initialLoading,
  storedUsername: typeof window !== 'undefined' ? window.localStorage.getItem(USERNAME) || '' : '',
  storedId: typeof window !== 'undefined' ? window.localStorage.getItem(ID) || '' : '',
  setStoredId: (id: string) => set({ storedId: id }),
  setStoredUsername: (username: string) => set({ storedUsername: username }),
  requestError: '',
  twoFAStatus: false,
  setRequestError: (error: string) => set({ requestError: error }),
  setUserInfo: (newUserInfo) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...newUserInfo },
    })),
  forceUpdate: () => set((state) => ({
    userInfo: { ...state.userInfo },
  })),
  setInitialUserInfo: (newUserInfo) =>
    set((state) => ({
      initialUserInfo: { ...state.initialUserInfo, ...newUserInfo },
    })),
  setIsValueChange: (fields) =>
    set((state) => ({
      isValueChange: { ...state.isValueChange, ...fields },
    })),
  setIsEdit: (fields) =>
    set((state) => ({
      isEdit: { ...state.isEdit, ...fields },
    })),
  setSelectedSection: (section) => set({ selectedSection: section }),
  setLoading: (loading) => set({ loading: loading }),
  setTwoFAStatus: (status) => set({ twoFAStatus: status }),
  reset: () => set({
    userInfo: initialUserInfo,
    initialUserInfo: initialUserInfo,
    isValueChange: initialBooleanState,
    isEdit: initialBooleanState,
    selectedSection: initialSelectedSection,
    loading: initialLoading,
    storedUsername: '',
    storedId: '',
    requestError: '',
    twoFAStatus: false,
  }),
}));

export const handleCancel = (section: keyof UserInfo | 'name') => {
  const { setIsEdit, setUserInfo, initialUserInfo, setRequestError } = useUserInfoStore.getState();
  if (section === 'name') {
    setIsEdit({
      name: {
        firstName: false,
        lastName: false,
      },
    });
    setUserInfo({
      name: {
        firstName: initialUserInfo.name.firstName,
        lastName: initialUserInfo.name.lastName,
      },
    });
    setRequestError('');
  } else {
    setIsEdit({ [section]: false });
    setUserInfo({ [section]: initialUserInfo[section] });
    setRequestError('');
  }
};

export const handleValueChanged = (
  section: keyof typeof userInfo | 'firstName' | 'lastName',
  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
) => {
  const {
          userInfo, setUserInfo, isValueChange, setIsValueChange, initialUserInfo, setRequestError,
        } = useUserInfoStore.getState();
  setRequestError('');
  const initialInfo = initialUserInfo as typeof userInfo;
  if (section === 'firstName' || section === 'lastName') {
    if (e.target.value !== initialInfo.name[section]) {
      setUserInfo({
        ...userInfo,
        name: { ...userInfo.name, [section]: e.target.value },
      });
      setIsValueChange({
        ...isValueChange,
        name: { ...isValueChange.name, [section]: true },
      });
    } else if (e.target.value === initialInfo.name[section]) {
      console.log('e.target.value: ', e.target.value);
      console.log('initialInfo.name[section]: ', initialInfo.name[section]);
      setUserInfo({
        ...userInfo,
        name: { ...userInfo.name, [section]: e.target.value },
      });
      setIsValueChange({
        ...isValueChange,
        name: { ...isValueChange.name, [section]: false },
      });
    }
  } else {
    if (e.target.value !== initialInfo[section]) {
      setUserInfo({ ...userInfo, [section]: e.target.value });
      setIsValueChange({ ...isValueChange, [section]: true });
    } else if (e.target.value === initialInfo[section]) {
      setUserInfo({ ...userInfo, [section]: e.target.value });
      setIsValueChange({ ...isValueChange, [section]: false });
    }
  }
};


export const useUserActions = () => {
  const [updateUser] = useMutation(UPDATE_USER);
  const {
          userInfo, isValueChange, isEdit, setIsEdit, setUserInfo, setIsValueChange, setLoading,
          setRequestError, setInitialUserInfo, initialUserInfo, storedId,
        } = useUserInfoStore.getState();

  const handleSubmit = async (
    input: SubmitInput,
    section: keyof typeof userInfo | 'name',
  ) => {
    setLoading(true);
    try {
      const { data } = await updateUser({
        variables: {
          id: storedId,
          input: section === 'name' ? { firstName: input.firstName, lastName: input.lastName } : input,
        },
      });
      return { data: data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: keyof typeof userInfo | 'name') => {
    if (section === 'name') {
      if (userInfo[section].firstName !== initialUserInfo[section].firstName || userInfo[section].lastName !== initialUserInfo[section].lastName) {
        const { error } = await handleSubmit(
          { firstName: userInfo.name.firstName, lastName: userInfo.name.lastName }, 'name');
        error && setRequestError(error);
        if (!error) {
          setIsEdit({ ...isEdit, name: { firstName: false, lastName: false } });
          setUserInfo({
            ...userInfo,
            name: {
              firstName: userInfo.name.firstName,
              lastName: userInfo.name.lastName,
            },
          });
          setIsValueChange({ ...isValueChange, name: { firstName: false, lastName: false } });
          setInitialUserInfo({ name: { firstName: userInfo.name.firstName, lastName: userInfo.name.lastName } });
        }
      } else {
        handleCancel(section);
      }
    } else {
      if (userInfo[section] !== initialUserInfo[section]) {
        const { error } = await handleSubmit({ [section]: userInfo[section] }, section);
        error && setRequestError(error);
        if (!error) {
          setIsEdit({ ...isEdit, [section]: false });
          setUserInfo({ ...userInfo, [section]: userInfo[section] });
          setInitialUserInfo({ [section]: userInfo[section] });
          setIsValueChange({ ...isValueChange, [section]: false });
        }
      } else {
        handleCancel(section);
      }
    }
  };
  return { handleSave };
};

