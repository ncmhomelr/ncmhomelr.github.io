import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: { xs: '480px', ...defaultTheme.screens },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        editorial: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // Paleta cálida NCM Home
        cream: {
          50:  '#FDFCFA',
          100: '#FAF8F5',
          200: '#F4F0EB',
          300: '#EAE4DC',
          400: '#DDD6CB',
          500: '#C8BEB2',
        },
        espresso: {
          50:  '#F5F0EC',
          100: '#E8DED6',
          200: '#C9B8A8',
          300: '#A89078',
          400: '#8B7055',
          500: '#70543C',
          600: '#5A4130',
          700: '#432F20',
          800: '#2D1F13',
          900: '#1C1410',
        },
        sienna: {
          400: '#B07040',
          500: '#8B5E3C',
          600: '#6E4A2E',
        },
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in':         'fade-in 0.2s ease-out',
        'slide-in-right':  'slide-in-right 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-right': 'slide-out-right 0.22s ease-in',
      },
    },
  },
  plugins: [],
}

