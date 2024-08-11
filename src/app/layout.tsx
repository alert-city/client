import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ProviderWrapper from '@/lib/ProviderWrapper';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alert City',
  description: 'A CMS for managing campus events and activities including registration and ticketing.',
};

const RootLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <html lang="en">
    <body className={inter.className}>
    <ProviderWrapper>{children}</ProviderWrapper>
    </body>
    </html>
  );
};

export default RootLayout;
