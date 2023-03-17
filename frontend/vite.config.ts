import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    host: "127.0.0.1",
    port: 3000,
    origin: "http://localhost:3000/3000"
    // host: true,
  },
  build: {
    target: 'esnext',
  },
})
