import { REVOKE_TOKENS } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import { ACCESS_TOKEN, ACCOUNT_TYPE } from '@/shared/constants/storage';
import { useRouter } from 'next/navigation';
import { RouteConfig } from '@/routes/route';
import { IndexConfig } from '@/routes';
import Cookies from 'js-cookie';
import { useUserInfoStore } from '@/store/profileState';

export const useRevokeTokens = () => {
  const router = useRouter();
  const { reset } =  useUserInfoStore();

  const clearDataAndRedirect = () => {
    IndexConfig.RemoveItems.Item.forEach((item) => {
      localStorage.removeItem(item);
    });
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(ACCOUNT_TYPE);
    reset();
    router.push(RouteConfig.Login.Path);
  };

  const [revokeTokens] = useMutation(REVOKE_TOKENS, {
    onCompleted: clearDataAndRedirect,
    onError: clearDataAndRedirect,
  });

  return revokeTokens;
};