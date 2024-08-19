'use client';
import React, { useEffect, useState } from 'react';
import NavigationBarLayout from '@/modules/navigationLayout/NavigationBarLayout';
import ResetPassword from '@/modules/reset-password/ResetPassword';
import { AUTH_TOKEN } from '@/shared/constants/storage';

const ResetPasswordPage: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    setAuthToken(token);
  }, []);

  if (authToken === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <ResetPassword />
      </div>
    );
  } else {
    return (
      <NavigationBarLayout isCentered>
        <div className="flex justify-center items-center">
          <ResetPassword />
        </div>
      </NavigationBarLayout>
    );
  }
};

export default ResetPasswordPage;