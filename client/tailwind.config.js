/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#228072", // Dark teal for primary color
        secondary: "#038A7C", // Medium teal for secondary color
        accent: "#F8E17B", // Yellow for accent color
        dark: "#228072", // Dark teal for dark elements
        light: "#FFFFFF", // White for light elements
        teal: {
          100: "#E6F2F0", // Lightest teal
          200: "#C4E1DD", // Lighter teal
          300: "#69B2A9", // Light teal
          400: "#038A7C", // Medium teal
          500: "#228072", // Dark teal (primary)
        },
        yellow: {
          100: "#FEF9E7", // Lightest yellow
          200: "#FCF3CF", // Lighter yellow
          300: "#F8E17B", // Light yellow (accent)
          400: "#F5D76E", // Medium yellow
          500: "#F2CA50", // Dark yellow
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
