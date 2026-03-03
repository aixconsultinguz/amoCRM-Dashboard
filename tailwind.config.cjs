/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05070B",
        bgElevated: "#0B0F17",
        accent: "#4F46E5",
        accentSoft: "#1E1B4B",
        borderSoft: "#1E2534",
        textMuted: "#9CA3AF"
      },
      boxShadow: {
        glow: "0 0 40px rgba(79, 70, 229, 0.35)"
      }
    }
  },
  plugins: []
};

