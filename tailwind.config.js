/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#f0f6fe',
            100: '#ddeafe',
            200: '#c3dbfd',
            300: '#99c3fc',
            400: '#67a2f9',
            500: '#3b82f6',
            600: '#1d5ec9',
            700: '#1e40af',
            800: '#1e3a8a',
            900: '#0f2b5c',
            950: '#0a192f',
          },
          green: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
          }
        },
        // Dark mode surface scale — true black foundation
        surface: {
          base: '#000000',
          raised: '#0A0A0A',
          overlay: '#111111',
          card: '#111111',
          dropdown: '#0f0f0f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        script: ['Dancing Script', 'cursive'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -2px rgba(15, 43, 92, 0.06), 0 2px 6px -1px rgba(15, 43, 92, 0.04)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 30px -4px rgba(15, 43, 92, 0.12), 0 4px 8px -2px rgba(15, 43, 92, 0.06)',
        'nav': '0 1px 12px rgba(0,0,0,0.08)',
        'hero': '0 32px 80px -12px rgba(15, 43, 92, 0.18)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'zoom-in-95': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-from-top-2': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'slide-up': 'slide-up 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        'in': 'slide-up 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        // Aliases for Tailwind animate-in pattern used in existing code
        'fade-in-zoom-in-95': 'zoom-in-95 150ms ease-out',
        'slide-in-from-top-2': 'slide-in-from-top-2 150ms ease-out',
      },
    },
  },
  plugins: [],
}
