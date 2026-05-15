/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16201E",
        ocean: "#2563EB",
        mint: "#0F766E",
        coral: "#E85D75",
        gold: "#C88319",
        pearl: "#FAF7F2"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(22, 32, 30, 0.10)",
        glow: "0 20px 60px rgba(15, 118, 110, 0.18)"
      }
    }
  },
  plugins: []
};
