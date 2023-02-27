import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    preact(),
    prefetch({
      selector: "a[href^='/blog']",
    }),
    compress(),
  ],
  markdown: {
    syntaxHighlight: "prism",
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "static/scripts/entry.[hash].js",
          chunkFileNames: "static/scripts/chunks/chunk.[hash].js",
          assetFileNames: "static/assets/asset.[hash][extname]",
        },
      },
    },
  },
});
