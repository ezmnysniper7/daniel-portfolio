const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    // Old single-portfolio URLs now live under the engineer world.
    return [
      { source: '/:locale(en|zh-CN)/about', destination: '/:locale/engineer/about', permanent: true },
      { source: '/:locale(en|zh-CN)/projects', destination: '/:locale/engineer/projects', permanent: true },
      { source: '/:locale(en|zh-CN)/projects/:slug', destination: '/:locale/engineer/projects/:slug', permanent: true },
      { source: '/:locale(en|zh-CN)/contact', destination: '/:locale/engineer/contact', permanent: true },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
