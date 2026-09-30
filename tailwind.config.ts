import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#09090D',
        surface: '#121218',
        raised: '#1B1B24',
        line: '#24242F',
        brand: {
          DEFAULT: '#7C5CFF',
          soft: '#A594FF',
          deep: '#5433E6',
        },
        up: '#3DDC97',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        num: ['var(--font-num)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 320ms cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
