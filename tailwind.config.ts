import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark studio palette — premium creative OS
        canvas: {
          DEFAULT: "#080808",   // body background
          50:  "#111111",       // card / primary surface
          100: "#1A1A1A",       // elevated surface / hover states
          200: "#242424",       // chips, subtle bg, strong dividers
          300: "#2E2E2E",       // borders on elevated surfaces
        },
        ink: {
          DEFAULT: "#F5F5F5",   // primary text
          secondary: "#888888", // secondary text
          tertiary: "#444444",  // muted / placeholder text
          inverse: "#080808",   // dark text (for use on light surfaces)
        },
        border: {
          DEFAULT: "#242424",
          strong: "#333333",
        },
        // Gold — CTAs, artist name, key labels only
        gold: {
          DEFAULT: "#C8923A",
          50:  "#1A1200",
          100: "#2A1E00",
          200: "#4D3800",
          300: "#8A5E1A",
          400: "#B07830",
          500: "#C8923A",
          600: "#A07228",
        },
        // Status / semantic — calibrated for dark backgrounds
        emerald: {
          50:  "#0A1F13",
          100: "#102B1C",
          200: "#173D27",
          500: "#4CAF7D",
          600: "#3EA870",
          700: "#2E9362",
        },
        amber: {
          50:  "#1A1200",
          100: "#2A1E00",
          200: "#3D2D00",
          400: "#E8A838",
          500: "#D4952E",
          600: "#B87820",
        },
        rose: {
          50:  "#1A0A0A",
          100: "#2A1010",
          200: "#3D1616",
          500: "#D95F5F",
          600: "#C24F4F",
          700: "#A83F3F",
        },
        sky: {
          50:  "#080F1A",
          100: "#0D1A2A",
          200: "#142438",
          500: "#4BA8D4",
          600: "#3390BC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cal)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.6), 0 2px 4px -1px rgba(0,0,0,0.4)",
        dropdown: "0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
        glow: "0 0 24px rgba(200,146,58,0.25)",
        "glow-white": "0 0 24px rgba(255,255,255,0.06)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulse_soft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-left": "slide-in-left 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.2s ease-out",
        pulse_soft: "pulse_soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
