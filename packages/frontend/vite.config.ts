import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "node:path";

const publicStaticFileDir = "static"

// https://vite.dev/config/
export default defineConfig({
  plugins: [...react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  define: {
    'process.env.KEYCLOAK_BASE_URL': '"https://keycloak.p1m.nl"',
    'process.env.KEYCLOAK_REALM': '"master"', 
    'process.env.KEYCLOAK_CLIENT_ID': '"badgehub-api-frontend"',
    'process.env.BADGEHUB_API_BASE_URL': '"http://localhost:8081"',
    'process.env.NODE_ENV': '"development"',
    'process.env.BADGE_SLUGS': '"why2025,troopers23,mch2022"',
    'process.env.CATEGORY_NAMES': '"Uncategorised,Event related,Games,Graphics,Hardware,Utility,Wearable,Data,Silly,Hacking,Troll,Unusable,Adult,Virus,SAO,Interpreter"',
    'process.env.ADMIN_CATEGORY_NAMES': '"Default"',
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: publicStaticFileDir + "/entry_[name]-[hash].js",
        chunkFileNames: publicStaticFileDir + "/chunks/[name]-[hash].js",
        assetFileNames: publicStaticFileDir + "/assets/[name]-[hash].[ext]",
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          return null;
        },
      },
    },
  },
});
