import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // World-aware tokens (flip via [data-world])
        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-2': 'hsl(var(--accent-2) / <alpha-value>)',
        // Base surfaces / text
        paper: 'hsl(var(--bg) / <alpha-value>)',
        'paper-2': 'hsl(var(--bg-2) / <alpha-value>)',
        panel: 'hsl(var(--panel) / <alpha-value>)',
        ink: 'hsl(var(--ink) / <alpha-value>)',
        'ink-2': 'hsl(var(--ink-2) / <alpha-value>)',
        'ink-3': 'hsl(var(--ink-3) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        // Trading / semantic signals
        up: 'hsl(var(--up) / <alpha-value>)',
        down: 'hsl(var(--down) / <alpha-value>)',
        gold: 'hsl(var(--gold) / <alpha-value>)',
        warm: 'hsl(var(--warm) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 24px 60px -42px hsl(var(--accent) / 0.4), 0 2px 10px -6px hsl(var(--ink) / 0.08)',
        glow: '0 0 0 1px hsl(var(--accent) / 0.25), 0 18px 50px -22px hsl(var(--accent) / 0.5)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'aurora-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-4%,0) scale(1.12)' },
          '66%': { transform: 'translate3d(-5%,5%,0) scale(0.95)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'aurora-drift': 'aurora-drift 22s ease-in-out infinite',
        'float-soft': 'float-soft 7s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
