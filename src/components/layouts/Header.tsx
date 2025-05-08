"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/main-logo.png";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import NotiRegisterButton from "../NotiRegisterButton";

export default function Header() {
  const CustomTrigger = () => {
    const { toggleSidebar } = useSidebar();
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
      </Sheet>
    );
  };
  return (
    <header className="container mx-auto flex h-16 w-full max-w-[800px] items-center justify-between px-4">
      {/* 왼쪽: 사이드바 + 로고 묶음 */}
      <div className="flex items-center gap-3">
        <CustomTrigger />
        <Link href="/">
          <Image
            src={Logo}
            width={140}
            alt="시피나우-로고"
            placeholder="blur"
            priority
            unoptimized
          />
        </Link>
      </div>
      {/* 오른쪽: 알림 버튼 */}
      <NotiRegisterButton />
    </header>
  );
}
