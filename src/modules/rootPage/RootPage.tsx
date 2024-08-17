'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_TOKEN, LOGIN_INFO } from '@/shared/constants/storage';
import { getRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';

const RootPage:React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN) : null;
    const storedLoginInfo = typeof window !== 'undefined' ? localStorage.getItem(LOGIN_INFO) : null;

    if (token && storedLoginInfo) {
      const parsedLoginInfo = JSON.parse(storedLoginInfo);
      setAccountType(parsedLoginInfo?.accountType || null);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // if (isAuthenticated === null) {
  //   // 在身份验证过程中显示一个加载指示器
  //   return <div>Loading...</div>;
  // }

  if (accountType === 'organization') {
    router.push('/admin'+ getRouteByKey(ROUTE_KEY.SUBMISSION).path);
  }

  if (accountType === 'personal') {
    router.push('/staff' + getRouteByKey(ROUTE_KEY.SUBMISSION).path);
  }

  // 无法识别账户类型时不渲染内容
  return null;

}

export default RootPage;