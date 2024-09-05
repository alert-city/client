import { USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL, ROLE,ACCESS_TOKEN,ACCOUNT_TYPE,CAN_SHOW_SNACKBAR } from '@/shared/constants/storage';

const Organization = {
  AccountType: 'Organization',
};

const Personal = {
  AccountType: 'Personal',
};

const SideBarAdmin = {
  Page: ['Review', 'Submission', 'Staff'],
};

const SideBarPersonal = {
  Page: ['Submission'],
};

const Setting = {
  Page: ['profile', 'resetPassword', 'preferences', 'logout'],
};

const RemoveLocalStorage = {
  Item: [USERNAME,IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL, CAN_SHOW_SNACKBAR],
};

const RemoveCookie = {
  Item: [ACCESS_TOKEN, ACCOUNT_TYPE, ROLE],
};

const languageOptions = [
  { code: 'AU', key: 'en' },
  { code: 'CN', key: 'zh-cn' },
];

const IconTheme = {
  Light: '/images/alertcity-light.png',
  Dark: '/images/alertcity-dark.png',
};


export const IndexConfig = {
  Organization,
  Personal,
  SideBarAdmin,
  SideBarPersonal,
  Setting,
  RemoveLocalStorage,
  languageOptions,
  IconTheme,
  RemoveCookie,
};
