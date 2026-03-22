/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f2efe8',
        ink: '#0e0d0b',
        primary: '#E85D75',
        'primary-dark': '#973D4C'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace']
      }
    }
  },
  plugins: []
};