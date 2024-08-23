import React from 'react';
import Activate from '@/modules/auth/activate/ActivatePage';
import { RouteConfig } from '@/routes/route';

export const metadata = RouteConfig.Activate.Metadata;

const ActivatePage: React.FC = () => {
  return (
    <Activate />
  );

};

export default ActivatePage;