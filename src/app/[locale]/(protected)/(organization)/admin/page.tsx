import React from 'react';
import { RouteConfig } from '@/routes/route';
import Dashboard from '@/modules/dashboard/Dashboard';

export const metadata = RouteConfig.Dashboard.Metadata;

const page: React.FC = () => {
  return (
    <Dashboard />
  );
};

export default page;