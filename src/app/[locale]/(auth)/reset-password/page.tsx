import React from 'react';
import ResetPassword from '@/modules/reset-password/ResetPasswordPage';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.ResetPassword.Metadata;

const ResetPasswordPage: React.FC = () => {
  return (
    <ResetPassword />
  );
};

export default ResetPasswordPage;