import { FIND_USER_BY_USERNAME, UPDATE_USER_BY_USERNAME, UPDATE_USER, FIND_ONE_USER_BY_ID } from '@/graphql/user';
import { useQuery, useMutation } from '@apollo/client';
import { useUserInfoStore } from '@/store/profileState';
import { SEND_UPDATE_USERNAME_EMAIL } from '@/graphql/user';


export const useFindOneUserById = (id: string) => {
  const { data, error } = useQuery(FIND_ONE_USER_BY_ID, {
    variables: {
      id,
    },
    skip: !id,
  });
  return { data: data?.findOneUser, error };
};
