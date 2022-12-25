/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            pre: {
              marginTop: 0,
              borderTopLeftRadius: 0,
              "--tw-prose-pre-code": "hsl(var(--bc))",
              "--tw-prose-pre-bg": "hsl(var(--b3))",
              border: "unset",
            },

            h2: {
              paddingBottom: "0.25em",
              borderBottom: "1px solid hsla(var(--bc)/0.15)",
            },

            img: {
              marginTop: "0.5em",
              marginBottom: "0.5em",
            }
          },
        },
      }),
    },
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
          error: "#AB3D30",
        },
      },
    ],
  },
};
