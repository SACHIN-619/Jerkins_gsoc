/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jenkins: {
          blue: '#1A56A0',
          dark: '#1A1A2E',
          accent: '#2563EB',
        }
      }
    }
  },
  plugins: [],
}
