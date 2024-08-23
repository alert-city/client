import React from 'react';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.UserManagement.Metadata

const UserManagementPage: React.FC = () => {
  return (
    <div>
      <h1>User Management</h1>
    </div>
  );
};

export default UserManagementPage;