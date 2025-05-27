import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    serverActions: {
    bodySizeLimit: '7mb', // or whatever value you want
    allowedOrigins: ['https://hex-management.vercel.app/'],
  }, // Unlocks server actions (Next.js 14+)
  
  },
  images: {
    domains: ['your-supabase-bucket-url', 'cdn.shadcn.com'],
    // Add domains you use for images (e.g., Supabase storage)
  },
   
   
};

export default nextConfig;
