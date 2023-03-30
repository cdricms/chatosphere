import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    host: "127.0.0.1",
    // host: true,
    // proxy: {
    //   "*/socket.io": {
    //     target: "ws://localhost:8080",
    //     ws: true,
    //   }
    // }
  },
  build: {
    target: 'esnext',
  },
})
