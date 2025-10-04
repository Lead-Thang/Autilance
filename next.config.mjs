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
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
      };
    }
    
    // Handle Node.js globals for server-side code
    if (isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new config.webpack.DefinePlugin({
          __dirname: false,
          __filename: false,
        })
      );
    } else {
      // For client-side, we can define these if needed
      config.resolve.alias = {
        ...config.resolve.alias,
        path: require.resolve('path-browserify'),
      };
    }
    
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client',
      '@supabase/supabase-js',
      '@supabase/ssr'
    ]
  }
}

export default nextConfig
