

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        animation: {
          'fill-block': 'fill-block 0.3s ease-out forwards',
        },
        keyframes: {
          'fill-block': {
            '0%': { opacity: '0', transform: 'scale(0.6)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
        },
      }
      
    },
    plugins: [],
  }
