/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f5dca8',
          300: '#efc26e',
          400: '#e8a534',
          500: '#d4841a',
          600: '#b36310',
          700: '#8d480f',
          800: '#703913',
          900: '#5a2f14',
        },
        dark: {
          900: '#0a0f0d',
          800: '#0f1a13',
          700: '#162218',
          600: '#1e2f22',
          500: '#253a28',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0a0f0d 0%, #0f2416 50%, #0d1f10 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, rgba(15,26,19,0.8) 100%)',
        'green-glow': 'radial-gradient(circle at center, rgba(34,197,94,0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34,197,94,0.3)',
        'glow-earth': '0 0 20px rgba(212,132,26,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
