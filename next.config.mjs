import createNextIntlPlugin from 'next-intl/plugin';
import nextPWA from 'next-pwa';

const withNextIntl = createNextIntlPlugin();

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  clientsClaim: true, //新的 Service Worker 自动接管所有页面，而不是等到下一次刷新页面时才接管
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_REST_API_URL: process.env.NEXT_PUBLIC_REST_API_URL,
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
};

export default withNextIntl(withPWA(nextConfig));