"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import ProductList from "@/src/components/ProductList";

const MAX_RECENTS = 10;
const LOCAL_STORAGE_KEY = "cpnow_recent_keywords";

export default function SearchModalClient() {
  const router = useRouter();
  const ranOnce = useRef(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const moveClose = useCallback(() => {
    const hasReferrer =
      document.referrer !== "" && document.referrer !== window.location.href;

    setTimeout(() => {
      if (hasReferrer) {
        router.back();
        // } else {
        //   router.push("/rocket");
      }
    }, 300);
  }, [router]);

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return;

    const updated = [
      keyword,
      ...recentKeywords.filter((k) => k !== keyword),
    ].slice(0, MAX_RECENTS);

    setRecentKeywords(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    router.push(`/search/${keyword}`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(1);
      setOpen(false);
      handleSearch(inputValue.trim());
    }
  };

  const removeKeyword = (keyword: string) => {
    const updated = recentKeywords.filter((k) => k !== keyword);
    setRecentKeywords(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAllKeywords = () => {
    setRecentKeywords([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const getRecentViewedProducts = (): any[] => {
    try {
      const raw = localStorage.getItem("recentViewedProducts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        console.log(2);
        moveClose();
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [moveClose]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (ranOnce.current) return; // 두 번째 실행 차단
    ranOnce.current = true;
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const items = getRecentViewedProducts();
    if (saved) {
      setRecentKeywords(JSON.parse(saved));
    }
    const filterItems = items.filter((item) => item.id);
    setRecentProducts(filterItems);
    setOpen(true);
  }, []);

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        console.log(3);
        if (!isOpen) moveClose();
      }}
    >
      <DrawerContent
        aria-hidden="false"
        className="!fixed !inset-0 !m-0 !h-screen !max-h-screen !w-screen !rounded-none !border-none !transition-none !duration-0 [&>div.bg-muted]:hidden"
      >
        <DrawerHeader className="p-4">
          <DrawerTitle className="flex items-center justify-between gap-2">
            <Input
              ref={inputRef}
              placeholder="검색어를 입력해주세요"
              className="bg-muted h-10 w-full rounded-full px-4 text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <button onClick={() => handleSearch(inputValue)}>
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
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="space-y-6 px-4 py-2 text-sm">
          <div>
            <div className="mb-2 flex items-center justify-between font-semibold">
              <span>🔍 최근 검색어</span>
              <button
                className="text-xs text-gray-400"
                onClick={clearAllKeywords}
              >
                전체 삭제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                >
                  <button
                    className="text-sm"
                    onClick={() => {
                      setOpen(false);

                      console.log(4);
                      router.push(`/search/${keyword}`);
                    }}
                  >
                    {keyword}
                  </button>
                  <X
                    className="h-4 w-4 cursor-pointer text-gray-400"
                    onClick={() => removeKeyword(keyword)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 font-semibold">🛒 최근 본 상품</div>
            <div className="scrollbar-hide -mx-4 overflow-x-auto px-4">
              <div className="flex flex-nowrap gap-3">
                {recentProducts.length === 0 ? (
                  <span className="text-sm text-gray-400">
                    최근 본 상품이 없습니다.
                  </span>
                ) : (
                  <ProductList items={recentProducts} type="carousel" />
                )}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
