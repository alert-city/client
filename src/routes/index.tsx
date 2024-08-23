import { USERNAME, ACCOUNT_TYPE, TEMP_USERNAME } from '@/shared/constants/storage';

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
  Item: [USERNAME, ACCOUNT_TYPE, TEMP_USERNAME],
};


export const IndexConfig = {
  Organization,
  Personal,
  SideBarAdmin,
  SideBarPersonal,
  Setting,
  RemoveItems,
};
