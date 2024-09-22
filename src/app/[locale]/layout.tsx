import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ProviderWrapper from '@/lib/ProviderWrapper';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const ThemeWrapper = dynamic(() => import('@/modules/theme/ThemeWrapper'), { ssr: false })

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alert City',
  description: 'A CMS for managing campus events and activities including registration and ticketing.',
  icons: {
    icon: '/images/alertcity-dark.png',
    apple: '/images/alertcity-IOS.png',
  },
};

type RootLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

const RootLayout = async ({ children, params: { locale } }: RootLayoutProps) => {
  const messages = await getMessages();
  return (
    <html lang={locale}>
    <head>
      <title>Alert City</title>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ffffff" />
    </head>
    <body className={inter.className}>
    <ProviderWrapper>
      <ThemeWrapper>
      <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </ThemeWrapper>
    </ProviderWrapper>
    </body>
    </html>
  );
};

export default RootLayout;
