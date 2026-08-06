import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
  cacheOnNavigation: true,
  additionalPrecacheEntries: [
    { url: '/offline', revision },
  ],
})

const nextConfig: NextConfig = {

  experimental: {
    viewTransition: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
}

export default withSerwist(nextConfig)