import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { ApolloLink } from '@apollo/client/link/core';
import { ACCESS_TOKEN } from '@/shared/constants/storage';
import Cookies from 'js-cookie';
import { RouteConfig } from '@/routes/route';
import { IndexConfig } from '@/routes';

let apolloClient: ApolloClient<any>;

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
  });

  const responseLink = new ApolloLink((
    operation,
    forward,
  ) => {
    return forward(operation).map((response) => {
      if (typeof window !== 'undefined') {
        const context = operation.getContext();
        const headers = context.response?.headers;
        const newAccessToken = headers?.get('New-Access-Token');
        const authStatus = headers?.get('Auth-Status');
        if (newAccessToken) Cookies.set(ACCESS_TOKEN, newAccessToken);
        if (authStatus === 'invalid') {
          const currentLocale = Cookies.get('NEXT_LOCALE') ?? 'en';
          IndexConfig.RemoveLocalStorage.Item.forEach((item) => {
            localStorage.removeItem(item);
          });
          IndexConfig.RemoveCookie.Item.forEach((item) => {
            Cookies.remove(item);
          });
          window.location.href = RouteConfig.Login.PathWithLocale(currentLocale);
        }
      }
      return response;
    });
  });

  const wsLink =
    typeof window !== 'undefined'
      ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? 'ws://localhost:51003/subscriptions',
          connectionParams: {
            reconnect: true,
          },
          retryAttempts: Infinity, // 自动重连

          keepAlive: 30000, // 30 seconds
          // retryAttempts: 5,

          on: {
            connected: () => console.log('websocket connected'),
            closed: () => console.log('websocket closed'),
            error: (err: any) => console.error('error', err),
          },
        }),
      )
      : null;

  const splitLink =
    typeof window !== 'undefined' && wsLink
      ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink,
      )
      : httpLink;

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path, extensions }) => {
        const { status, code, data } = extensions || {};
        const errorDetails = {
          message,
          path,
          code,
          status,
          ...(typeof data === 'object' && data !== null && { data })
        };
        console.error(`Error: ${JSON.stringify(errorDetails, null, 2)}`);
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  const logLink = new ApolloLink((
    operation,
    forward,
  ) => {
    return forward(operation).map((response) => {
      console.log('Connection: GraphQL request completed successfully');
      return response;
    });
  });

  const link = ApolloLink.from([errorLink, responseLink, logLink, splitLink]);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: link,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}
