/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.js", "./src/**/*.{js, jsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}

