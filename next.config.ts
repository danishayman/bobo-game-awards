import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gmyyxiyesmdaernmhjam.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Optimize image loading performance
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days (longer cache)
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimized image sizes for nominee cards (3:4 aspect ratio)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [96, 128, 192, 256, 384, 512], // Better sizes for nominee cards
    // Limit concurrent image optimizations for better server performance
    domains: [], // Use remotePatterns instead
    // Enable aggressive image optimization
    quality: 80, // Slightly lower quality for faster loading
    // Add custom loader for IGDB images if needed
    unoptimized: false,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@tanstack/react-query'],
    // Enable optimistic navigation for better perceived performance
    optimisticClientCache: true,
  },
  // Enable compression
  compress: true,
  // Optimize bundle
  swcMinify: true,
  // Enable static optimization where possible
  output: 'standalone',
};

export default nextConfig;
