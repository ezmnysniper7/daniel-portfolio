const { execSync } = require('child_process');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// The commit and time of this build, shown in the footer's status bar.
function buildSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { BUILD_SHA: buildSha(), BUILD_TIME: new Date().toISOString() },
  // One small stylesheet: inline it so it never blocks first paint.
  experimental: { inlineCss: true },
  async redirects() {
    // Old URLs (single portfolio, then the engineer/property split) all land on the new one-pager.
    // Sources never overlap: Vercel doesn't reliably give the first matching rule priority.
    const L = ':locale(en|zh-CN)';
    return [
      { source: `/${L}/engineer/projects/:slug`, destination: '/:locale/work/:slug', permanent: true },
      { source: `/${L}/projects/:slug`, destination: '/:locale/work/:slug', permanent: true },
      { source: `/${L}/engineer`, destination: '/:locale', permanent: true },
      { source: `/${L}/engineer/:page(about|projects|contact)`, destination: '/:locale', permanent: true },
      { source: `/${L}/property`, destination: '/:locale', permanent: true },
      { source: `/${L}/property/:path*`, destination: '/:locale', permanent: true },
      { source: `/${L}/:page(about|projects|contact)`, destination: '/:locale', permanent: true },
      // Dan is hidden until launch; temporary so search engines don't forget the URL.
      { source: `/${L}/work/dan`, destination: '/:locale', permanent: false },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
