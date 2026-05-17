import type { Config } from "tailwindcss";

// Neo-Brutalism — B&W + Sharpie Yellow
// Thick black borders · hard offset shadows · zero radius · yellow accent only
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The one accent
        yellow: {
          DEFAULT: "#FAC800",
          dark:    "#D9A800",
        },
        // Monochrome system
        ink:     "#0A0A0A",
        muted:   "#555555",
        border:  "#0A0A0A",
        surface: "#FFFFFF",
        canvas:  "#FAFAFA",
        // Aliases so old primary: classes compile
        primary: {
          DEFAULT: "#FAC800",
          dark:    "#D9A800",
          light:   "#FFF4A3",
        },
        // Status — greyscale only
        success: "#1A1A1A",
        warning: "#FAC800",
        error:   "#0A0A0A",
        coral: {
          DEFAULT: "#FAC800",
          light:   "#FFF4A3",
        },
      },
      fontFamily: {
        sans:    ["'Montserrat'", "system-ui", "sans-serif"],
        display: ["'League Spartan'", "system-ui", "sans-serif"],
        serif:   ["'League Spartan'", "system-ui", "sans-serif"],
        mono:    ["'Montserrat'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        mobile: "390px",
      },
      borderRadius: {
        // Neo-brutalism = sharp
        none:  "0px",
        sm:    "2px",
        DEFAULT: "2px",
        card:  "2px",
        btn:   "2px",
        chip:  "2px",
        pill:  "2px",
        full:  "2px",
      },
      boxShadow: {
        // Hard offset — no blur, no spread
        card:    "4px 4px 0 #0A0A0A",
        btn:     "4px 4px 0 #0A0A0A",
        "btn-sm":"2px 2px 0 #0A0A0A",
        "btn-press":"1px 1px 0 #0A0A0A",
        overlay: "6px 6px 0 #0A0A0A",
      },
    },
  },
  plugins: [],
};

export default config;
