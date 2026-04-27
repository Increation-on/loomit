import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Отключаем CSP только в разработке
  ...(process.env.NODE_ENV === 'development' && {
    headers: async () => [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://*.google.com",
          },
        ],
      },
    ],
  }),
}

export default nextConfig