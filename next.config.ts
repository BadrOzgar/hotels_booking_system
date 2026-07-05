import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.booking.nexudev.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB, which breaks any real photo/video upload sent through a Server Action's FormData.
      bodySizeLimit: "120mb",
    },
  },
};

export default nextConfig;
