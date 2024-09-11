import React from 'react';
import LoginForm from '../../../../modules/auth/login/LoginForm';
import LoginLayout from '@/app/[locale]/(auth)/login/layout';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Login.Metadata;

const LoginPage: React.FC = () => {
  return (
    <LoginLayout>
      <LoginForm />
      <p className="text-center text-sm text-gray-600 mt-6">
        By signing in, you agree to our{' '}
        <RouteConfig.PrivacyPolicy.Link className="text-blue-500 hover:underline">
          Privacy Policy
        </RouteConfig.PrivacyPolicy.Link>
      </p>
    </LoginLayout>
  );
};

export default LoginPage;