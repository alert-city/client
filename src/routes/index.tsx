import { USERNAME, TEMP_USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL } from '@/shared/constants/storage';

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

const RemoveItems = {
  Item: [USERNAME, TEMP_USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL],
};

const languageOptions = [
  { code: 'AU', key: 'en' },
  { code: 'CN', key: 'zh-cn' },
];


export const IndexConfig = {
  Organization,
  Personal,
  SideBarAdmin,
  SideBarPersonal,
  Setting,
  RemoveItems,
  languageOptions,
};
