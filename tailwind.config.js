/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        display: [
          '"Space Grotesk"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px rgba(16, 24, 40, 0.06)",
        "card-lg": "0 2px 4px rgba(16, 24, 40, 0.05), 0 12px 32px rgba(16, 24, 40, 0.10)",
        // Aliases kept so existing shadow-glass references stay valid.
        glass: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px rgba(16, 24, 40, 0.06)",
        "glass-lg": "0 2px 4px rgba(16, 24, 40, 0.05), 0 12px 32px rgba(16, 24, 40, 0.10)",
      },
      keyframes: {
        "aurora-drift": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(24px, -20px) scale(1.08)" },
        },
      },
      animation: {
        "aurora-drift": "aurora-drift 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
