'use client';
import { ApolloProvider } from '@apollo/client';
import { initializeApollo } from './apolloClient';
import React from 'react';
import { SessionProvider } from 'next-auth/react';

const ProviderWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const client = initializeApollo();

  return (
    <SessionProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  );
};

export default ProviderWrapper;
