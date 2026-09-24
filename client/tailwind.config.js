/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7fb",
          100: "#d9edf5",
          200: "#b3dcec",
          300: "#7fc3dd",
          400: "#45a3c9",
          500: "#1c7fa8",
          600: "#116089",
          700: "#0e4d6f",
          800: "#0c3f5a",
          900: "#0a3349",
        },
        teal: {
          500: "#0d9488",
          600: "#0f766e",
        },
        canvas: "#F5F8FB",
        ink: "#1E293B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 42, 67, 0.06), 0 4px 16px rgba(16, 42, 67, 0.06)",
        cardHover: "0 6px 24px rgba(16, 42, 67, 0.12)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
