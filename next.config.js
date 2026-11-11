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

// Web Analytics runs on the production site only. Set NEXT_PUBLIC_ANALYTICS=off in Vercel to stop it.
const analytics = process.env.NEXT_PUBLIC_ANALYTICS || (process.env.VERCEL_ENV === 'production' ? 'vercel' : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { BUILD_SHA: buildSha(), BUILD_TIME: new Date().toISOString(), NEXT_PUBLIC_ANALYTICS: analytics },
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
      { source: `/${L}/engineer/:page(about|contact)`, destination: '/:locale/:page', permanent: true },
      { source: `/${L}/engineer/projects`, destination: '/:locale/work', permanent: true },
      { source: `/${L}/property`, destination: '/:locale', permanent: true },
      { source: `/${L}/property/:path*`, destination: '/:locale', permanent: true },
      // /about and /contact are real pages again; only the old projects index still redirects.
      { source: `/${L}/projects`, destination: '/:locale/work', permanent: true },
      // The service pages were reorganised around fintech work (Nov 2026).
      { source: `/${L}/services/crypto-trading-systems`, destination: '/:locale/services/trading-platform-engineering', permanent: true },
      // Short links for outreach messages.
      { source: '/founders', destination: '/en/services/fintech-technical-partner', permanent: false },
      { source: `/${L}/founders`, destination: '/:locale/services/fintech-technical-partner', permanent: false },
      { source: '/mt5', destination: '/en/services/mt5-manager-api-developer', permanent: false },
      // Dan is hidden until launch; temporary so search engines don't forget the URL.
      { source: `/${L}/work/dan`, destination: '/:locale', permanent: false },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
