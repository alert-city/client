import { FIND_ONE_USER } from '@/graphql/user';
import { useQuery, useMutation } from '@apollo/client';

export const useFindOneUserById = (id: string) => {
  const { data, error } = useQuery(FIND_ONE_USER, {
    variables: {
      id,
    },
    skip: !id,
  });
  return { data: data?.findOneUser, error };
};
