import withPWA from 'next-pwa';

// Configure PWA with proper settings for Next.js 15
const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  cacheStartUrl: true,
  // Fix for build issues with Next.js 15
  buildExcludes: [/^.*\.map$/],
  // Add additional PWA assets
  additionalManifestEntries: [
    {
      url: '/api/stores',
      revision: '1'
    }
  ],
});

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
}

export default withPWAConfig(nextConfig);