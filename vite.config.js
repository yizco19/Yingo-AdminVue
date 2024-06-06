import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  ,
  server: {
    proxy: {
      '/api': { // Obteniendo datos de la API
        target: 'https://bonefish-unbiased-quickly.ngrok-free.app',//Servidor de la API
        changeOrigin: true,//Cambiar el origen
        rewrite: (path) => path.replace(/^\/api/, '') //Reescribir la ruta 
      }
    }
  }
})
