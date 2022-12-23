/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

  daisyui: {
    styled: true,
    base: true,
    utils: true,
    themes: [
      "light",
      // "dark"
      {
        dark: {
          primary: "#163D64",
          secondary: "#62757F",
          accent: "#DC4318",
          neutral: "#1D2126",
          "base-100": "#212121",
          info: "#0092D6",
          success: "#6CB288",
          warning: "#DAAD58",
          error: "#AB3D30"
        },
      },
    ],
  },
};
