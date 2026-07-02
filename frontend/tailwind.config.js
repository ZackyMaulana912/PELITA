/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#1E3A5F",
          dark: "#1A2E48",
          light: "#2B5089",
        },
        amber: {
          DEFAULT: "#F5A823",
          light: "#FFBE3D",
          hover: "#DE9316",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 28px rgba(0,0,0,0.13)",
        panel: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
