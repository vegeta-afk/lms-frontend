import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy:
        mode === "development"
          ? {
              "/api": {
                target: env.VITE_API_URL || "http://localhost:5000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
              },
            }
          : undefined, // No proxy in production
    },
    base: "/",
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1000,
    },
    // Define global constants
    define: {
      __APP_ENV__: JSON.stringify(env.NODE_ENV),
    },
  };
});
