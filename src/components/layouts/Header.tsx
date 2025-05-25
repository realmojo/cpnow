"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/main-logo.png";
import MainSidebarRightButton from "../MainSidebarRightButton";

export default function Header() {
  return (
    <header className="container mx-auto flex h-16 w-full max-w-[800px] items-center justify-between px-4">
      {/* 왼쪽: 사이드바 + 로고 묶음 */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image
            src={Logo}
            width={140}
            alt="시피나우-로고"
            placeholder="blur"
            priority
          />
        </Link>
      </div>
      {/* 오른쪽: 알림 버튼 */}
      <MainSidebarRightButton />
    </header>
  );
}
