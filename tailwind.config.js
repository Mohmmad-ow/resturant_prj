/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/flowbite/**/*.js" , "./views/*.ejs", "./src/*.{html,js,css}", "./public/js/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
