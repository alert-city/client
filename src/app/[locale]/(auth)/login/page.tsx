import React from 'react';
import  LoginForm  from '../../../../modules/auth/login/LoginForm';
import { Box } from "@mui/material";
import LoginLayout from "@/app/[locale]/(auth)/login/layout";
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Login.Metadata;

const LoginPage: React.FC = () => {
  return (
    <LoginLayout>
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
      className="shadow-lg flex p-6 flex-col rounded-2xl"
    >
      <LoginForm />
    </Box>
    </LoginLayout>
  );
};

export default LoginPage;