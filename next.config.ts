// next.config.ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Ignores ESLint errors during builds on Vercel or locally
    ignoreDuringBuilds: true,
  },
  // Optional: Strict mode and SWC minify if you want 'em
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
