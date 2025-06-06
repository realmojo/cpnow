"use client";
import Link from "next/link";
import MainSidebarRightButton from "../MainSidebarRightButton";
// import { isWebView } from "@/utils/utils";

export default function Header() {
  // if (isWebView()) {
  //   return null;
  // }
  return (
    <header className="container mx-auto flex h-16 w-full max-w-[800px] items-center justify-between px-4">
      {/* 왼쪽: 사이드바 + 로고 묶음 */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 select-none"
        >
          <span className="text-3xl font-extrabold tracking-tight text-black">
            CP
          </span>
          <span className="text-primary text-3xl font-extrabold tracking-tight">
            NOW
          </span>
        </Link>
      </div>
      {/* 오른쪽: 알림 버튼 */}
      <MainSidebarRightButton />
    </header>
  );
}
