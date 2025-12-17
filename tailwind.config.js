/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F9F5ED',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#E0D5C4',
        },
        coral: {
          50: '#FEF2F1',
          100: '#FDE3E1',
          200: '#FBCCC8',
          300: '#F9A8A2',
          400: '#F97068',
          500: '#F24C3D',
          600: '#E02D1D',
          700: '#BC2315',
          800: '#9B2116',
          900: '#802118',
        },
        accent: {
          teal: '#3DBDB4',
          gold: '#F5B041',
        }
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
