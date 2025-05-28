import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // ... autres configurations
  resolve: {
    alias: {
      "@common": fileURLToPath(new URL("../common", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Ajoutez d'autres alias si nécessaire
    },
  },
})