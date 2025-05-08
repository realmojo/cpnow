import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [];
for (let i = 1; i <= 10; i += 1) {
  remotePatterns.push({
    protocol: "https",
    hostname: `thumbnail${i}.coupangcdn.com`, // 이미지 도메인
    pathname: "/**",
  });
  remotePatterns.push({
    protocol: "https",
    hostname: `image${i}.coupangcdn.com`, // 이미지 도메인
    pathname: "/**",
  });
  remotePatterns.push({
    protocol: "https",
    hostname: `img${i}a.coupangcdn.com`, // 이미지 도메인
    pathname: "/**",
  });
  remotePatterns.push({
    protocol: "https",
    hostname: `t${i}a.coupangcdn.com`, // 이미지 도메인
    pathname: "/**",
  });
}
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: process.env.NODE_ENV === "production" ? true : false,
  images: {
    remotePatterns,
  },
  unoptimized: true,
};

export default nextConfig;
