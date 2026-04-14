import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ibm: {
          blue: "#0f62fe",
          black: "#161616",
          gray100: "#f4f4f4",
          gray200: "#e0e0e0",
          gray300: "#a8a8a8",
          gray800: "#393939",
          gray900: "#262626",
          white: "#ffffff",
        }
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'sans-serif'],
        bangla: ['Inter', 'Noto Serif Bengali', 'sans-serif'],
        number: ['Inter', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
