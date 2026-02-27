/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest': '#4a5e2a',
        'sage': '#8a9a5b',
        'bark': '#8b6f47',
        'stone': '#b5a99a',
        'cream': '#f5f0e8',
        'water': '#4a7fa5',
      }
    },
  },
  plugins: [],
}
