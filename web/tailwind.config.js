/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#3B82F6',
        cta: '#F97316',
        background: '#F8FAFC',
        text: '#1E293B',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
