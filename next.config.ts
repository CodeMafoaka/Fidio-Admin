import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://fidio-api-dev.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;