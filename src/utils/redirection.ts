import { Locales, useRouter } from '@/i18n/routing';
import { RouteConfig } from '@/routes/route';
import { IndexConfig } from '@/routes';
import { useEffect, useState } from 'react';
import { getPreferenceInfo } from '@/utils/getPreferenceInfo';

interface TwoFARedirectState {
  accountType: string | undefined;
  role: string[] | undefined;
}

interface LoginRedirectState extends TwoFARedirectState {
  isFirstLogin: boolean;
}

export function useLogin() {
  const router = useRouter();

  const twoFARedirect = ({ accountType, role }: TwoFARedirectState) => {
    if (accountType === IndexConfig.Organization.AccountType) {
      router.push(RouteConfig.Admin.Path + RouteConfig.Dashboard.Path);
    } else if (accountType === IndexConfig.Personal.AccountType) {
      if (role?.includes('staff')) {
        router.push(RouteConfig.Staff.Path + RouteConfig.Dashboard.Path);
      }
    }
  };

  const loginRedirect = ({ isFirstLogin, accountType, role }: LoginRedirectState) => {
    if (isFirstLogin) {
      router.push(RouteConfig.Enable2FA.Path);
    } else {
      twoFARedirect({ accountType, role });
    }
  };

  return {
    loginRedirect,
    twoFARedirect,
  };
}