import { REVOKE_TOKENS } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import { useRouter } from '@/i18n/routing';
import { RouteConfig } from '@/routes/route';
import { IndexConfig } from '@/routes';
import Cookies from 'js-cookie';
import { useUserInfoStore } from '@/store/profileState';
import { useLoginUserInfo } from '@/store/loginUserInfoState';
import { signOut } from 'next-auth/react';

export const useLogout = () => {
  const router = useRouter();
  const { reset } = useUserInfoStore();
  const { clearUserInfo } = useLoginUserInfo();

  const clearDataAndRedirect = async () => {
    IndexConfig.RemoveLocalStorage.Item.forEach((item) => {
      localStorage.removeItem(item);
    });
    IndexConfig.RemoveCookie.Item.forEach((item) => {
      Cookies.remove(item);
    });
    reset();
    clearUserInfo();
    await signOut({ redirect: false });
    router.push(RouteConfig.Login.Path);
  };

  const [revokeTokens] = useMutation(REVOKE_TOKENS, {
    onCompleted: clearDataAndRedirect,
    onError: clearDataAndRedirect,
  });

  return {revokeTokens, clearDataAndRedirect};
};