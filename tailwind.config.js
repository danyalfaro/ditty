/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      animation: {
        openMenu: "openMenu 0.2s cubic-bezier(0.23, 0.04, 0.65, 0.95)",
      },
      keyframes: {
        openMenu: {
          "0%": { left: "-300px" },
          "100%": { left: "0px" },
        },
      },
      maxWidth: {
        main: "600px",
      },
      minWidth: {
        main: "216px",
      },
    },
  },
  plugins: [],
};
