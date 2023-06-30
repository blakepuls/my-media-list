/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          50: "#faf6fd",
          100: "#eadaf9",
          200: "#d8baf3",
          300: "#c292ec",
          400: "#b57ae8",
          500: "#8423d9",
          600: "#913add",
          700: "#7720c4",
          800: "#651ba7",
          900: "#4a147a",
        },
        gray: {
          50: "#fafafa",
          100: "#f1f1f1",
          200: "#e7e7e8",
          300: "#d4d4d4",
          400: "#adacad",
          500: "#7f7f80",
          600: "#555456",
          700: "#373638",
          800: "#202021",
          900: "#1a191b",
        },
      },
    },
  },
  plugins: [],
};
