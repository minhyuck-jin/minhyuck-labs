import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { NextConfig } from 'next'

const appDir = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  reactStrictMode: false,
  agentRules: false,
  turbopack: {
    root: appDir,
  },
  async rewrites() {
    const proxyTarget = process.env.LABS_API_PROXY_TARGET?.trim()

    // dev 프록시 대상이 없는 경우
    if (!proxyTarget) {
      return []
    }

    return [
      {
        source: '/labs-api/:path*',
        destination: `${proxyTarget}/labs-api/:path*`,
      },
    ]
  },
}

export default nextConfig
