import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Prevent bundling of firebase, rely on CDN via importmap
        'firebase/app',
        'firebase/firestore'
      ]
    }
  }
})