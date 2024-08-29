import React from 'react';
import Dashboard from '@/modules/dashboard/Dashboard';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Dashboard.Metada;

const DashboardPage: React.FC = () => {
    return <Dashboard/>
};

export default DashboardPage;