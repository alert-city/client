import React from 'react';
import RegisterForm  from '@/modules/auth/register/RegistrationPage';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Register.Metadata

const RegisterPage: React.FC = () => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;