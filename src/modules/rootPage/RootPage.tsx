'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN, ACCOUNT_TYPE } from '@/shared/constants/storage';
import { IndexConfig } from '@/routes';
import { RouteConfig} from '@/routes/route';
import Cookies from 'js-cookie';

const RootPage:React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? Cookies.get(ACCESS_TOKEN) : null;
    const accountType = typeof window !== 'undefined' ? Cookies.get(ACCOUNT_TYPE) : null;
    if (accessToken && accountType) {
      setAccountType(accountType);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push(RouteConfig.Login.Path);
    } else if (isAuthenticated === true) {
      if (accountType === IndexConfig.Organization.AccountType) {
        router.push('/admin' + RouteConfig.Dashboard.Path);
      } else if (accountType === IndexConfig.Personal.AccountType) {
        router.push('/staff' + RouteConfig.Dashboard.Path);
      }
    }
  }, [isAuthenticated, accountType, router]);

  // don't render anything if the user is not authenticated
  return null;

}

export default RootPage;