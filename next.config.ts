import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbnail8.coupangcdn.com", // 이미지 도메인
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
