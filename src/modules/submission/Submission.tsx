"use client";
import React, { useEffect, useState } from 'react';
import WelcomeSnackbar from '@/modules/welcome-snackbar/WelcomeSnackbar';
import { IS_FIRST_LOGIN } from '@/shared/constants/storage';

const SubmissionPage: React.FC = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<string | null>(null);

  useEffect(() => {
    const firstLogin = localStorage.getItem(IS_FIRST_LOGIN);
    setIsFirstLogin(firstLogin);
  }, []);

  return (
    <div>
      <h1> Submission Page </h1>
      {isFirstLogin === 'true' && <WelcomeSnackbar />}
    </div>
  );
};

export default SubmissionPage;