import createNextIntlPlugin from 'next-intl/plugin';
import nextPWA from 'next-pwa';

const withNextIntl = createNextIntlPlugin();

const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    clientsClaim: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    output: 'standalone',
};

export default withNextIntl(withPWA(nextConfig));