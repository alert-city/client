import React from 'react';
import Dashboard from '@/modules/dashboard/Dashboard';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Dashboard.Metadata;

const DashboardPage: React.FC = () => {
    return (
        <div className="min-h-screen flex justify-center items-center px-4 py-6">
            <Dashboard />
        </div>
    );
};

export default DashboardPage;