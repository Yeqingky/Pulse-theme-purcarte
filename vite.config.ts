import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: "assets",
    outDir: "dist",
    rollupOptions: {
      output: {
        chunkFileNames: "assets/chunk-[name]-[hash].js",
        entryFileNames: "assets/entry-[name]-[hash].js",
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
  },
});
