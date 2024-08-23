'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN } from '../constants/storage';
import { usePathname } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import Cookies from 'js-cookie';

const WrappedValidator: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? Cookies.get(ACCESS_TOKEN) : null;

    // 如果没有 accessToken，直接重定向到登录页面
    if (!accessToken) {
      router.push(RouteConfig.Login.Path);
      return;
    }

    // 如果以上验证都通过，则设置为已验证状态
    setIsAuthenticated(true);
  }, [pathname]);

  if (isAuthenticated === null) {
    // 在验证过程中，不渲染任何内容
    return null;
  }

  return <>{children}</>;
};

export default WrappedValidator;