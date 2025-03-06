import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['vortex-dev-bucket.s3.us-east-1.amazonaws.com'],
  }
};

export default nextConfig;
