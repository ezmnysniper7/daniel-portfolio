const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // One small stylesheet: inline it so it never blocks first paint.
  experimental: { inlineCss: true },
  async redirects() {
    // Old URLs (single portfolio, then the engineer/property split) all land on the new one-pager.
    const L = ':locale(en|zh-CN)';
    return [
      { source: `/${L}/engineer/projects/:slug`, destination: '/:locale/work/:slug', permanent: true },
      { source: `/${L}/projects/:slug`, destination: '/:locale/work/:slug', permanent: true },
      { source: `/${L}/engineer/:path*`, destination: '/:locale', permanent: true },
      { source: `/${L}/property/:path*`, destination: '/:locale', permanent: true },
      { source: `/${L}/:page(about|projects|contact)`, destination: '/:locale', permanent: true },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
