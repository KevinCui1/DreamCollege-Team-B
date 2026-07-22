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
          "Quicksand",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        // "Counselor's Almanac" families — govern the collection surfaces only.
        serif: ["Newsreader", "ui-serif", "Georgia", "serif"],
        body: [
          '"Public Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      colors: {
        // ── "Counselor's Almanac" tokens (collection surfaces). See DESIGN.md.
        paper: {
          DEFAULT: "#FAF6EE", // warm canvas
          card: "#FFFDF9", // surface
          deep: "#F1E9D9", // sunk wells / reused chips / progress track
        },
        // Almanac ink (kept separate from the shell's plum `ink` token).
        graphite: {
          DEFAULT: "#22201C",
          muted: "#6B6459",
          soft: "#9A9284",
        },
        evergreen: {
          50: "#EEF4F1",
          100: "#DDE8E4",
          200: "#BCD1C9",
          400: "#3C7C72",
          DEFAULT: "#14504A",
          600: "#14504A",
          700: "#0F3E39",
        },
        marigold: {
          50: "#FBF1E1",
          100: "#F5E3CB",
          200: "#ECCB9E",
          DEFAULT: "#C8781E",
          600: "#C8781E",
          700: "#A65E14", // white text meets WCAG AA (~5:1) — use for buttons/links
          800: "#7E4610",
        },
        line: "#E7DFD1", // warm hairline border
        sage: "#0F766E", // success
        oxblood: "#B4423A", // danger / validation

        // Lavender-centered scale: brighter → white, darker → vivid purple.
        lavender: {
          50: "#FAF7FF",
          100: "#F3EEFF",
          200: "#EDE6FF",
          300: "#D9CBFF",
          400: "#C9B8FF",
          500: "#A78BFA",
          600: "#8B5CF6",
          700: "#7C3AED",
          800: "#6D28D9",
          900: "#5B21B6",
        },
        // Warm plum inks — replace cold slate for headings/body.
        ink: {
          DEFAULT: "#2E1065",
          muted: "#6B5E92",
          soft: "#9488B4",
        },
      },
      boxShadow: {
        // Warm lavender-tinted soft-UI shadows.
        soft: "0 1px 2px rgba(76, 29, 149, 0.05), 0 6px 20px rgba(124, 58, 237, 0.08)",
        "soft-lg": "0 2px 6px rgba(76, 29, 149, 0.06), 0 16px 40px rgba(124, 58, 237, 0.14)",
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px rgba(16, 24, 40, 0.06)",
        "card-lg": "0 2px 4px rgba(16, 24, 40, 0.05), 0 12px 32px rgba(16, 24, 40, 0.10)",
        // Aliases kept so existing shadow-glass references stay valid.
        glass: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px rgba(16, 24, 40, 0.06)",
        "glass-lg": "0 2px 4px rgba(16, 24, 40, 0.05), 0 12px 32px rgba(16, 24, 40, 0.10)",
        // Warm paper-tinted almanac shadow.
        almanac: "0 1px 2px rgba(66, 52, 24, 0.05), 0 8px 24px rgba(66, 52, 24, 0.07)",
      },
      keyframes: {
        "aurora-drift": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(24px, -20px) scale(1.08)" },
        },
        // Almanac "Saved" stamp: a quick settle, honored by reduced-motion below.
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(1.12) rotate(-3deg)" },
          "60%": { opacity: "1", transform: "scale(0.97) rotate(-3deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-3deg)" },
        },
        "collect-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "aurora-drift": "aurora-drift 16s ease-in-out infinite",
        "stamp-in": "stamp-in 220ms ease-out",
        "collect-in": "collect-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};
