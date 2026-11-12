/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '20': 'repeat(20, minmax(0, 1fr))',
      },
      colors: {
        blokus: {
          blue: '#3b82f6',
          yellow: '#eab308',
          red: '#ef4444',
          green: '#22c55e',
        }
      }
    },
  },
  plugins: [],
}