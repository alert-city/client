import React from 'react';
import TwoFAPage  from '@/modules/auth/register/TwoFA';

const Enable2FAPage: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <TwoFAPage />
    </div>
  );
};

export default Enable2FAPage;