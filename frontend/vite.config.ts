import path from "path"
import { fileURLToPath } from "url" // <-- Import this
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Recreate the __dirname variable for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Now this line works perfectly
      "@": path.resolve(__dirname, "./src"),
    },
  },
})