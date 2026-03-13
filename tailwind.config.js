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
        gov: {
          navy: '#0a1628',
          blue: '#1a3a6b',
          mid: '#1e4080',
          accent: '#2563eb',
          light: '#3b82f6',
          gold: '#d4a017',
          surface: '#0f1e35',
          card: '#132238',
          border: '#1e3a5f',
        }
      },
      fontFamily: {
        sans: ['var(--font-main)', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
