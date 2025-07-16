/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // falls du /app-dir nutzt (Next.js 13+)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
