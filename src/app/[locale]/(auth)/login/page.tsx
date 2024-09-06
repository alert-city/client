import React from 'react';
import LoginForm from '../../../../modules/auth/login/LoginForm';
import { Box, Card } from '@mui/material';
import LoginLayout from '@/app/[locale]/(auth)/login/layout';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Login.Metadata;

const LoginPage: React.FC = () => {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
};

export default LoginPage;