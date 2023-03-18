/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs", "./src/*.{html,js,css}", "./public/js/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
