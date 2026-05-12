import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production builds
  productionBrowserSourceMaps: false,

  // Use Turbopack for faster builds (default in Next.js 16)
  // Removed webpack config to allow Turbopack to handle bundling

  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', '@supabase/supabase-js', 'axios'],
  },

  // Image optimization for Vercel
  images: {
    remotePatterns: [],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app',
  },

  // Strict mode for development
  reactStrictMode: true,

  // Headers for security and API
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },

  // Rewrites for API proxy (optional, for local development)
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app'}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
