import React from 'react';
import TwoFAPage  from '@/modules/auth/register/TwoFA';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Enable2FA.Metadata

const Enable2FAPage: React.FC = () => {
    return (
        <div className="min-h-screen flex justify-center items-center px-4 py-6">
            <TwoFAPage />
        </div>
    );
};

export default Enable2FAPage;