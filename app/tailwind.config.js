// Theme comes only from the design tokens. Regenerate with `npm run tokens`.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: require('./tailwind.tokens.js') },
  plugins: [],
};
