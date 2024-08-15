import { REVOKETOKENS } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import { AUTH_STATUS, AUTH_TOKEN, LOGIN_INFO } from '@/shared/constants/storage';
import { getPublicRouteByKey, ROUTE_KEY } from '@/routes/routeConfig';
import { useRouter } from 'next/navigation';

export const useRevokeTokens = () => {
  const router = useRouter();
  const [revokeTokens] = useMutation(REVOKETOKENS, {
    onCompleted: () => {
      localStorage.removeItem(AUTH_STATUS);
      localStorage.removeItem(LOGIN_INFO);
      localStorage.removeItem(AUTH_TOKEN);
      router.push(getPublicRouteByKey(ROUTE_KEY.LOGIN).path);
    },
  });
  return revokeTokens;
}