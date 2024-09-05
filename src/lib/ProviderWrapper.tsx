'use client';
import { ApolloProvider } from '@apollo/client';
import { initializeApollo } from './apolloClient';
import React from 'react';


const ProviderWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const client = initializeApollo();

  return (
      <ApolloProvider client={client}>{children}</ApolloProvider>
  );
};

export default ProviderWrapper;
