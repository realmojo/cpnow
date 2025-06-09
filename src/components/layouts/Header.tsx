"use client";
import { usePathname } from "next/navigation";
import MainSidebarRightButton from "../MainSidebarRightButton";

export default function Header() {
  const pathname = usePathname();

  // WebView에서는 헤더를 렌더링하지 않음
  // if (isWebView()) return null;

  // 경로별 제목 정의
  const getTitle = (path: string) => {
    if (path === "/mynow") return "❤️ 찜한 상품";
    if (path === "/categories") return "카테고리";
    if (path === "/now") return "🔥 NOW";
    if (path === "/search") return "🔎 검색";
    if (path === "/alarm") return "🔔 알람";
    if (path === "/rocket") return "🚀 로켓상품";
    if (path.includes("/product")) return "상품정보";
    if (path.includes("/search"))
      return `${decodeURIComponent(path.split("/")[2])} 검색`;
    return "CPNOW";
  };

  const title = getTitle(pathname);

  return (
    <header className="container mx-auto flex h-16 w-full max-w-[800px] items-center justify-between px-4 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.15)]">
      {/* 왼쪽: 제목 */}
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        {title}
      </h2>

      {/* 오른쪽: 알림 버튼 또는 설정 버튼 */}
      <MainSidebarRightButton />
    </header>
  );
}
