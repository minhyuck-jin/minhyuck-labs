import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const envDir = path.resolve(rootDir, 'env')
const srcDir = path.resolve(rootDir, 'src')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '')
  const proxyTarget =
    env.LABS_API_PROXY_TARGET?.trim() || 'http://localhost:8080'

  return {
    envDir,
    plugins: [react()],
    resolve: {
      alias: {
        '@': srcDir,
      },
    },
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/labs-api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
