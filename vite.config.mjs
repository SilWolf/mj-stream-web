import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '/mj-stream-web/',
  plugins: [react(), viteTsconfigPaths(), tailwindcss()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    port: 5173,
  },
})
