import React from 'react';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.StaffManagement.Metadata

const UserManagementPage: React.FC = () => {
  return (
    <div>
      <h1>User Management</h1>
    </div>
  );
};

export default UserManagementPage;