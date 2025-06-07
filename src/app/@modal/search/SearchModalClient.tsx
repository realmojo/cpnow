"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const recentKeywords = ["노트북", "플로피햇"];
const recommendedKeywords = [
  "빌레로이앤보흐",
  "3단트롤리",
  "안전화",
  "선크림",
  "플립플랍",
  "벽걸이에어컨",
  "소형냉장고",
  "모기퇴치기",
  "신발장",
  "멀티그릴",
  "쉬폰원피스",
  "쌀20kg",
];

export default function SearchModalClient() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const moveClose = useCallback(() => {
    const hasReferrer =
      document.referrer !== "" && document.referrer !== window.location.href;

    setTimeout(() => {
      if (hasReferrer) {
        router.back();
      } else {
        router.push("https://cpnow.kr/categories");
      }
    }, 300);
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        moveClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveClose]);

  return (
    <Drawer
      open={open}
      onOpenChange={() => {
        setOpen(false);
        moveClose();
      }}
    >
      <DrawerContent className="!fixed !inset-0 !m-0 !h-screen !max-h-screen !w-screen !rounded-none !border-none transition-all duration-100 ease-in-out [&>div.bg-muted]:hidden">
        <DrawerHeader className="p-4">
          <DrawerTitle className="flex items-center justify-between gap-2">
            <Input
              placeholder="검색어를 입력해주세요"
              className="bg-muted h-10 w-full rounded-full px-4 text-sm"
            />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-1.85z"
                />
              </svg>
            </button>
          </DrawerTitle>
        </DrawerHeader>

        <div className="space-y-6 px-4 py-2 text-sm">
          <div>
            <div className="mb-2 flex items-center justify-between font-semibold">
              <span>최근 검색어</span>
              <button className="text-xs text-gray-400">전체 삭제</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                >
                  {keyword}
                  <X className="h-4 w-4 cursor-pointer text-gray-400" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 font-semibold">추천 검색어</div>
            <div className="flex flex-wrap gap-2">
              {recommendedKeywords.map((keyword) => (
                <button
                  key={keyword}
                  className="bg-muted hover:bg-primary/10 rounded-full px-4 py-1 text-sm"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
