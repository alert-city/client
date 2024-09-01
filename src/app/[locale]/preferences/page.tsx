import React from 'react';
import { RouteConfig } from '@/routes/route';
import PreferencesPage from '@/modules/preferences/PreferencesPage';

export const metadata = RouteConfig.Preferences.Metadata;

const Preferences: React.FC = () => {
  return <PreferencesPage />;
};

export default Preferences;