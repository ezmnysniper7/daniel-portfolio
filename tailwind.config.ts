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
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#0A0A0A',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          dark: '#171717',
        },
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        accent: '#10B981',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
