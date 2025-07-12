/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'game-sky': '#4A90E2',
        'game-grass': '#7CB342',
        'game-gold': '#FFD700',
        'game-earth': '#8B7355',
        'game-bg': '#87CEEB',
        'game-success': '#4CAF50',
        'game-warning': '#FF9800',
        'game-error': '#F44336',
        'game-info': '#2196F3',
      },
      backgroundImage: {
        'sky-gradient': 'linear-gradient(to bottom, #87CEEB, #4A90E2)',
        'grass-gradient': 'linear-gradient(to bottom, #7CB342, #689F38)',
        'earth-gradient': 'linear-gradient(to bottom, #8B7355, #6D5B47)',
      },
    },
  },
  plugins: [],
}