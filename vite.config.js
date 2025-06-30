// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: { enabled: true },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "autoUpdate",
      injectManifest: { swSrc: "src/sw.js" },
      manifest: {
        name: "Voter-DB",
        short_name: "VoterDB",
        icons: [
          {
            src: "public/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "public/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "public/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "public/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        theme_color: "#fff",
        background_color: "#fff",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
      },
      includeAssets: ["favicon.svg", "robots.txt", "offline.html"],
    }),
  ],
});
