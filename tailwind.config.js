import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // El prototipo usaba clases `xs:` sin haber definido ese breakpoint, por lo
    // que Tailwind las ignoraba. Aquí se define (480px) para que hagan lo que
    // el código pretendía. Para volver al comportamiento exacto del prototipo,
    // elimina la línea `xs: '480px'`.
    screens: { xs: '480px', ...defaultTheme.screens },
    extend: {
      // El prototipo usaba `animate-fade-in` sin definirla. Se define aquí.
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
