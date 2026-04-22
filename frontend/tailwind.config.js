/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mood: {
          adventurous: '#FF6B6B',
          calm: '#4ECDC4',
          romantic: '#FFB6C1',
          stressed: '#95A5A6',
          excited: '#FFD93D',
          bored: '#6C5CE7',
        },
      },
    },
  },
  plugins: [],
}

