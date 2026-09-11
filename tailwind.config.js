/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'brand-red': '#F05454',
        'brand-off-white': '#F5F5F5',
        'brand-light-blue': '#ADD8E6',
        'brand-mid-blue': '#5C94BD',
        'brand-dark-blue': '#222831',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}