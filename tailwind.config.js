/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C5CE7",
          light: "#A29BFE",
          dark: "#5B4BC4",
        },
      },
    },
  },
  plugins: [],
};
