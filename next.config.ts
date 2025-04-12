import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname:
          "/dms/image/C4D03AQE5jX1v7b0gGQ/profile-displayphoto-shrink_800_800/0/1665077099998?e=2147483647&v=beta&t=6vX9A3pYzqk3xg2lL1rB3Rk-8JrK6rjZtJw8f1m5W4c",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname:
          "/dms/image/C4E03AQE5jX1v7b0gGQ/profile-displayphoto-shrink_800_800/0/1665077099998?e=2147483647&v=beta&t=6vX9A3pYzqk3xg2lL1rB3Rk-8JrK6rjZtJw8f1m5W4c",
      },
    ],

    domains: ["media.licdn.com"],
  },
};

export default nextConfig;
