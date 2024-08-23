import React from 'react';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Profile.Metadata

const ProfilePage: React.FC = () => {
  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  );
};

export default ProfilePage;