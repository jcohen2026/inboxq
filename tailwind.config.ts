import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c1f23",
        paper: "#f7f6f2",
        mint: "#4b9b74",
        signal: "#3868d6",
        ember: "#b55d3b",
        palms: {
          black: "#0a0a0a",
          gold: "#D4AF37",
          amber: "#FFBF00",
          panel: "#161616",
          accent: "#2D2412"
        }
      },
      boxShadow: {
        quiet: "0 1px 2px rgba(24, 27, 31, 0.08)",
        gold: "0 0 20px rgba(212, 175, 55, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
