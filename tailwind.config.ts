import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          850: '#1f1f1f',
        },
      },
    },
  },
  plugins: [],
};

export default config;
