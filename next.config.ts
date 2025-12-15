import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["got-scraping", "header-generator"],
  experimental: {
    outputFileTracingIncludes: {
      "/api/track": ["./node_modules/header-generator/data_files/**/*"],
    },
  },
};

export default nextConfig;
