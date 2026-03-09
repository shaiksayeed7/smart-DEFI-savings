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
        brand: {
          dark: '#050505',
          panel: '#111111',
          border: '#222222',
          ember: '#ff5e00',
          gold: '#ffb800',
          light: '#f5f5f5',
          muted: '#888888',
        }
      },
      backgroundImage: {
        'glow-gradient': 'radial-gradient(circle at center, rgba(255,94,0,0.15) 0%, rgba(0,0,0,0) 70%)',
      }
    },
  },
  plugins: [],
};
export default config;
