import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 禁用 ESLint 检查
  },
};

// export default nextConfig;
export default withNextIntl(nextConfig);