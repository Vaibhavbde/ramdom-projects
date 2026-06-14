/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5cb85c',
          500: '#3e8e3e',
          600: '#2d6a2d',
          700: '#245524',
          800: '#1e441e',
          900: '#1a3a1a',
        },
        earth: {
          50: '#faf8f3',
          100: '#f4f0e6',
          200: '#e8dcc7',
          300: '#d9c4a0',
          400: '#c8a677',
          500: '#b8915a',
          600: '#a67c4e',
          700: '#8a6542',
          800: '#70523a',
          900: '#5c4431',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      }
    },
  },
  plugins: [],
}