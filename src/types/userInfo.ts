export interface UserInfo {
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
  id: string;
}