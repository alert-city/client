import React from 'react';
import Activate from '@/modules/auth/EmailLinkValidation/ValidateEmailPage';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Activate.Metadata;

const ActivatePage: React.FC = () => {
  return (
    <Activate />
  );

};

export default ActivatePage;