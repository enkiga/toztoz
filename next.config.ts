import type { NextConfig } from "next";

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
  },
};

export default nextConfig;
