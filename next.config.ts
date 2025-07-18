import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or whatever value you want
      allowedOrigins: ['https://hex-management.vercel.app/'],
    }, // Unlocks server actions (Next.js 14+)

  },
  images: {
    domains: ['etfqwejgpqszeglrqaza.supabase.co', 'cdn.shadcn.com', "images.unsplash.com" , "via.placeholder.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'etfqwejgpqszeqlrqaza.supabase.co',
        pathname: '/storage/v1/object/public/img/**',
      },
    ],
    // Add domains you use for images (e.g., Supabase storage)
  },


};

export default nextConfig;
