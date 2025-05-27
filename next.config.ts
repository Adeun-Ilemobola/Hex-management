import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true, // Faster builds
  experimental: {
    serverActions: {
    bodySizeLimit: '7mb', // or whatever value you want
    allowedOrigins: ['https://hex-management.vercel.app/'],
  }, // Unlocks server actions (Next.js 14+)
    nodeMiddleware: true, // For custom node middleware (as needed)
    // turbo mode is not stable yet, but keep an eye on it!
    // turbo: true, 
    // For edge runtime, see notes below
  },
  images: {
    domains: ['your-supabase-bucket-url', 'cdn.shadcn.com'],
    // Add domains you use for images (e.g., Supabase storage)
  },
   
   
};

export default nextConfig;
