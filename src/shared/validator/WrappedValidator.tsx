'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_STATUS, AUTH_TOKEN } from '../constants/storage';
import { useRevokeTokens } from '@/hooks/useRevokeTokens';
import { usePathname } from 'next/navigation';
import { getPublicRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';

const WrappedValidator: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const revokeTokens = useRevokeTokens();
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN) : null;
    const authStatus = typeof window !== 'undefined' ? localStorage.getItem(AUTH_STATUS) : 'invalid';

    // 如果没有 token，直接重定向到登录页面
    if (!token) {
      router.push(getPublicRouteByKey(ROUTE_KEY.LOGIN).path);
      return;
    }

    // 如果 authStatus 是 'invalid'，触发登出逻辑
    if (authStatus === 'invalid') {
      revokeTokens().then(() => {});
      return;
    }

    // 如果以上验证都通过，则设置为已验证状态
    setIsAuthenticated(true);
  }, [router, pathname, revokeTokens]);

  if (isAuthenticated === null) {
    // 在验证过程中，不渲染任何内容
    return null;
  }

  return <>{children}</>;
};

export default WrappedValidator;