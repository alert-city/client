import { USERNAME, ACCOUNT_TYPE, TEMP_USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME } from '@/shared/constants/storage';

const Organization = {
  AccountType: 'Organization',
};

const Personal = {
  AccountType: 'Personal',
};

const SideBarAdmin = {
  Page: ['Review', 'Submission', 'User Management'],
};

const SideBarPersonal = {
  Page: ['Submission'],
};

const Setting = {
  Page: ['Profile', 'Reset Password', 'Logout'],
};

const RemoveItems = {
  Item: [USERNAME, ACCOUNT_TYPE, TEMP_USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME],
};


export const IndexConfig = {
  Organization,
  Personal,
  SideBarAdmin,
  SideBarPersonal,
  Setting,
  RemoveItems,
};
