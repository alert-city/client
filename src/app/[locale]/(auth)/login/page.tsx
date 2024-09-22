import React from 'react';
import LoginForm from '../../../../modules/auth/login/LoginForm';
import LoginLayout from '@/app/[locale]/(auth)/login/layout';
import { RouteConfig } from '@/routes/route';
import { useTranslations } from 'next-intl';

export const metadata = RouteConfig.Login.Metadata;

const LoginPage: React.FC = () => {
  const t = useTranslations('LoginPage');
  return (
    <LoginLayout>
      <LoginForm />
      <p className="text-center text-sm text-gray-600 mt-6">
        {t('signInAgreement')}{' '}
        <RouteConfig.PrivacyPolicy.Link className="text-blue-500 hover:underline">
          { t('privacyPolicy')}
        </RouteConfig.PrivacyPolicy.Link>
      </p>
    </LoginLayout>
  );
};

export default LoginPage;