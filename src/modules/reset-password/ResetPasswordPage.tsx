'use client';
import React, { useEffect, useState } from 'react';
import NavigationBarLayout from '@/modules/navigationLayout/NavigationBarLayout';
import ResetPassword from '@/modules/reset-password/ResetPassword';
import { ACCESS_TOKEN } from '@/shared/constants/storage';
import Cookies from 'js-cookie';

const ResetPasswordPage: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? Cookies.get(ACCESS_TOKEN) : null;
    setAccessToken(accessToken || null);
  }, []);

  if (accessToken === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <ResetPassword />
      </div>
    );
  } else {
    return (
      <NavigationBarLayout>
        <div className="flex justify-center items-center">
          <ResetPassword />
        </div>
      </NavigationBarLayout>
    );
  }
};

export default ResetPasswordPage;