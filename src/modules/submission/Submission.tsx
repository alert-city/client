"use client";
import React, { useEffect, useState } from 'react';
import WelcomeSnackbar from '@/modules/welcome-snackbar/WelcomeSnackbar';
import { CAN_SHOW_SNACKBAR, IS_FIRST_LOGIN } from '@/shared/constants/storage';

const SubmissionPage: React.FC = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<string | null>(null);

  useEffect(() => {
    const canShowSnackbar = localStorage.getItem(CAN_SHOW_SNACKBAR);
    setIsFirstLogin(canShowSnackbar);
  }, []);

  return (
    <div>
      <h1> Submission Page </h1>
      {isFirstLogin === 'true' && <WelcomeSnackbar />}
    </div>
  );
};

export default SubmissionPage;