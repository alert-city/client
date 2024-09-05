import React from 'react';
import Update from '@/modules/auth/EmailLinkValidation/ValidateEmailPage';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Activate.Metadata;

const UpdatePage: React.FC = () => {
  return (
    <Update />
  );
};

export default UpdatePage;