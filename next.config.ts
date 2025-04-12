import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "static.licdn.com",
      },
    ],
    dangerouslyAllowSVG: true, // Required for SVG files
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Security measure
  },
};

export default nextConfig;
