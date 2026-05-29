import type { NextConfig } from 'next'
import withSerwist from '@serwist/next'

const nextConfig: NextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "script-src 'self' 'unsafe-eval'",
        },
      ],
    },
  ],
}

export default withSerwist({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: false,
  swUrl: '/sw.js',
  include: ['/', '/offline'],
})(nextConfig)