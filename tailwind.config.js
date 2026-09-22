/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Bold dark theme. Near-black canvas, off-white ink, committed electric blue.
        base: {
          DEFAULT: '#050507',
          soft: '#0d0e12',
          raised: '#14161c',
        },
        ink: {
          DEFAULT: '#f4f5f7',
          soft: '#b4b8c2',
          faint: '#6b7280',
        },
        accent: {
          DEFAULT: '#2f6bff',
          soft: '#5b8bff',
          glow: '#1e4fd8',
        },
      },
      fontSize: {
        // Oversized editorial display sizes.
        display: ['clamp(3rem, 12vw, 11rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(2.25rem, 7vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        content: '80rem',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'accent-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'accent-pulse': 'accent-pulse 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
