import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      "@electric-sql/pglite",
      "@electric-sql/pglite-react",
      "@lottiefiles/react-lottie-player",
    ],
  },
  worker: {
    format: "es",
  },
  plugins: [react(), tailwindcss()],
});
