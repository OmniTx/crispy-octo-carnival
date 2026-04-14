/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Tie build output to the git commit on Vercel so asset URLs change every deploy (helps CDN/cache confusion).
  generateBuildId: async () => process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`,
  images: {
    loader: 'custom',
    loaderFile: './supabase-image-loader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
};

module.exports = nextConfig;
