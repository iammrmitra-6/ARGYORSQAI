import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "static",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/main.js"),
      output: {
        entryFileNames: "js/app.js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] || assetInfo.name || "";
          if (name.endsWith(".css")) return "css/app.css";
          return "assets/[name][extname]";
        },
      },
    },
  },
});
