import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#185FA5",
          dark: "#0C447C",
          light: "#E6F1FB",
        },
        success: "#1D9E75",
        warning: "#D97706",
        error: "#D85A30",
        surface: "#F5F6F8",
        ink: "#1A1A1A",
        muted: "#6B7280",
        border: "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        mobile: "390px",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        chip: "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(24,95,165,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
