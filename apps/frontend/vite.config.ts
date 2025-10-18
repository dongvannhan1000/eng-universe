import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
// import {visualizer} from 'rollup-plugin-visualizer'
// import { cspHeader } from "./src/utils/cspHeader";
// import mkcert from 'vite-plugin-mkcert'

// const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [
    // isDev ? mkcert() : [],
    react(),
    tailwindcss(),
    // visualizer({
    //   filename: './dist/stats.html',
    //   open: false,
    //   gzipSize: true,
    //   brotliSize: true,
    //   template: 'treemap'
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT as any) || 4173,
    strictPort: true,
  },

  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT as any) || 5173,
    strictPort: true,
    allowedHosts: [process.env.VITE_FRONTEND_URL as string],
  },

  // server: {
  //   host: '0.0.0.0',
  //   port: parseInt(process.env.PORT as any) || 4173,
  //   strictPort: true,
  //   // headers: cspHeader
  // },
  // preview: {
  //   host: '0.0.0.0',
  //   port: parseInt(process.env.PORT as any) || 4173,
  //   strictPort: true,
  //   allowedHosts: ['echo-chat-cqg2.onrender.com'],
  //   // headers: cspHeader
  // },
});
