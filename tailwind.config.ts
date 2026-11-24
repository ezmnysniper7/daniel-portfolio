import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'hsl(var(--ink) / <alpha-value>)',
        'ink-2': 'hsl(var(--ink-2) / <alpha-value>)',
        bone: 'hsl(var(--bone) / <alpha-value>)',
        'bone-2': 'hsl(var(--bone-2) / <alpha-value>)',
        'bone-3': 'hsl(var(--bone-3) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        signal: 'hsl(var(--signal) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        // Headings use the body face: one typeface across the site.
        display: ['var(--font-sans)', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono-face)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'monospace'],
      },
      maxWidth: {
        page: '96rem',
      },
    },
  },
  plugins: [],
};

export default config;
