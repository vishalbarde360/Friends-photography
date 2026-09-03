/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F5EF",
        beige: "#E8D8C3",
        mocha: "#8B6F5A",
        espresso: "#211C18",
        terracotta: "#B98268",
        softwhite: "#FFFDF9",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      letterSpacing: {
        wide2: "0.14em",
      },
    },
  },
  plugins: [],
};
