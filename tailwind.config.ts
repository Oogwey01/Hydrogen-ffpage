import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          beige: "#C89D69",
          "beige-light": "#D4B48A",
          "beige-dark": "#B08A55",
          gray: "#323232",
          "gray-light": "#4A4A4A",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        akira: ["Akira Expanded", "sans-serif"],
        barlow: ["Barlow", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        dafoe: ["Mr Dafoe", "cursive"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-down": "slideDown 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "marquee-left": "marquee-left 35s linear infinite",
        "marquee-right": "marquee-right 35s linear infinite",
        "logo-pulse": "logo-pulse 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "marquee-left": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "logo-pulse": {
          "0%, 45%":   { filter: "grayscale(1) brightness(0) invert(1)", opacity: "0.4" },
          "50%, 95%":  { filter: "grayscale(0) brightness(1) invert(0)", opacity: "1" },
          "100%":      { filter: "grayscale(1) brightness(0) invert(1)", opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
