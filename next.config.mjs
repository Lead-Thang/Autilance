import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals,
        'sharp',
        'quiche',
        '@img/sharp-win32-x64',
        '@img/sharp-linux-x64-gnu',
        '@prisma/client',
        '@prisma/fetch-engine'
      ]
    }
    return config
  },
  serverExternalPackages: [
    '@prisma/client',
    '@supabase/supabase-js',
    '@supabase/ssr'
  ],
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client',
      '@supabase/supabase-js',
      '@supabase/ssr'
    ]
  }
}

export default nextConfig
