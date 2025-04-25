// src/next-seo.config.ts
const siteUrl = "https://www.cpnow.kr";

export const defaultSEO = {
  title: "CPNOW - 쿠팡 가격 변동 알림 서비스",
  description:
    "CPNOW는 쿠팡 상품의 실시간 가격 변동을 추적하고 최저가 알림을 제공합니다. 스마트한 소비를 위한 필수 도구!",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    site_name: "CPNOW",
    images: [
      {
        url: `${siteUrl}/icons/apple-icon.png`,
        width: 1200,
        height: 630,
        alt: "CPNOW 오픈그래프 이미지",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
    handle: "@cpnow_official",
  },
};
