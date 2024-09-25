import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as Popper from "@popperjs/core";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      layouts: path.resolve(__dirname, "./src/layouts"), // Example alias
      assets: path.resolve(__dirname, "./src/assets"), // Example alias
      components: path.resolve(__dirname, "./src/components"), // Example alias
      views: path.resolve(__dirname, "./src/views"),
      variables: path.resolve(__dirname, "./src/variables"),
    },
  },
  server: {
    historyApiFallback: true, // Ensures index.html is served for all routes
  },
});
