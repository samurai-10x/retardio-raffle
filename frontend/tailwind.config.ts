import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        primary: "#B624A9",
        secondary: "#020204",
      },
      fontFamily: {
        laila: "var(--font-laila)",
        detacher: "var(--font-detacher)",
      },
    },
  },
  plugins: [],
};
export default config;
