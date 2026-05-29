import type { NextConfig } from 'next'
import { withSerwist } from '@serwist/turbopack'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default withSerwist(nextConfig)