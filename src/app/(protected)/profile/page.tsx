import React from 'react';
import { RouteConfig } from '@/routes/route';
import ProfileForm from '@/modules/profile/ProfileForm';

export const metadata = RouteConfig.Profile.Metadata;

const ProfilePage: React.FC = () => {
  return  <ProfileForm />
};

export default ProfilePage;