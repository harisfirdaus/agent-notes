import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9f9f9",
        surface: "#ffffff",
        "surface-muted": "#f3f3f3",
        "surface-dim": "#e8e8e8",
        border: "#c1c7d2",
        outline: "#727781",
        primary: "#004173",
        "primary-container": "#00599a",
        gold: "#f3c727",
        danger: "#c92b2c",
        ink: "#1b1b1b",
        "ink-muted": "#414750"
      },
      boxShadow: {
        paper: "0 4px 20px rgba(0, 0, 0, 0.04)",
        modal: "0 10px 30px rgba(0, 0, 0, 0.08)"
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: [forms]
};

export default config;
