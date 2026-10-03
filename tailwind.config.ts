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
        // Latin in Fraunces; CJK falls to the system sans already loaded for body text (fast, consistent).
        display: ['var(--font-display)', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'monospace'],
      },
      maxWidth: {
        page: '96rem',
      },
    },
  },
  plugins: [],
};

export default config;
