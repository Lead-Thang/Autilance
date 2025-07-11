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
  output: 'standalone',
  // Replace __dirname with ESM-compatible approach
  workspaceDir: fileURLToPath(new URL('.', import.meta.url)),
}

export default nextConfig
