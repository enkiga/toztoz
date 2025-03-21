import type { NextConfig } from "next";
import { format } from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // get images from unsplash
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.graphassets.com",
      },
      
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
