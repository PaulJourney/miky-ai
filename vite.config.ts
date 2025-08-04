import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path';
const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

// https://vite.dev/config/
export default defineConfig({
  base: '',
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  optimizeDeps: {
    exclude: ["same-runtime/dist/jsx-runtime", "same-runtime/dist/jsx-dev-runtime"]
  }
});