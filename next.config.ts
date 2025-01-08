import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // get images from unsplash
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
