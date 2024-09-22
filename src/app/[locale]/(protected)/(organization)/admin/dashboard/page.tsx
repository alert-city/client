import React from 'react';
import Dashboard from '@/modules/dashboard/Dashboard';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Dashboard.Metadata;

const DashboardPage: React.FC = () => {
    return <Dashboard />
};

export default DashboardPage;