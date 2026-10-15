/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinic: {
          green: "#234B3A",
          dark: "#173629",
          cream: "#F8F6EF",
          gold: "#C6A96B",
        },
      },
    },
  },
  plugins: [],
};