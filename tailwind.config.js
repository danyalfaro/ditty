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
        textGradient: "textGradient 5s ease infinite alternate",
      },
      keyframes: {
        openMenu: {
          "0%": { left: "-300px", opacity: "0%" },
          "100%": { left: "0px", opacity: "100%" },
        },
        textGradient: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
      maxWidth: {
        main: "600px",
      },
      minWidth: {
        main: "216px",
      },
      spacing: {
        "screen-dvh": "100dvh",
      },
    },
  },
  plugins: [],
};
