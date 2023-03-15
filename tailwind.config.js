/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html, js, ejs}", "./public/css/src/**/*.{html, js, ejs}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
