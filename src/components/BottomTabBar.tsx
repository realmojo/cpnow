// components/BottomTabBar.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  Heart,
  Flame,
  LinkIcon,
  ShoppingCart,
  LayoutGrid,
  AlertCircle,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getUserAuth, validateCoupangLink } from "@/utils/utils";
import { toast } from "sonner";
import { useAppStore } from "../store/useAppStore";

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");

  const { open, openLink, setOpen, setOpenLink } = useAppStore();

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setLink(newLink);

    // 실시간 유효성 검사
    const error = validateCoupangLink(newLink);
    setLinkError(error);
  };

  const handleAddLink = async () => {
    if (link.trim()) {
      const auth = await getUserAuth();
      if (!auth) {
        toast.error("알람 설정 후 이용해주세요.");
        return;
      }

      const params = {
        userId: auth.userId,
        link,
      };

      const res = await fetch("/api/product/add/link", {
        method: "POST",
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("상품이 추가되었습니다.");
        setOpen(false);
        setLink(""); // 입력 필드 초기화
        setOpenLink(false);

        if (pathname.includes("mynow")) {
          location.href = "/mynow";
        } else {
          router.push("/mynow");
        }
      } else {
        toast.error("상품 추가에 실패했습니다.");
      }

      // API 호출이나 상태 업데이트 등
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (open) {
        setOpen(false);
      }
    };

    // Drawer가 열릴 때 history state 추가
    if (open) {
      window.history.pushState({ drawerOpen: true }, "");
    }

    // popstate 이벤트 리스너 추가
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [open, setOpen]);

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[40%] rounded-t-2xl">
          <DrawerHeader className="m-0 p-0">
            <DrawerTitle className="flex items-center justify-between text-xl font-semibold"></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>

          <div className="mt-4 space-y-3 px-4">
            <Button
              asChild
              variant="outline"
              className="hover:bg-muted w-full justify-start gap-3 px-4 py-6 text-left shadow-sm"
            >
              <a href="https://link.coupang.com/a/cvKd21" target="_blank">
                <ShoppingCart className="text-primary h-5 w-5" />
                <div>
                  <p className="font-medium">쿠팡에서 추가하기</p>
                </div>
              </a>
            </Button>

            <Button
              variant="outline"
              className="hover:bg-muted w-full justify-start gap-3 px-4 py-6 text-left shadow-sm"
              onClick={() => {
                setOpen(false);
                setOpenLink(true);
              }}
            >
              <LinkIcon className="text-primary h-5 w-5" />
              <div>
                <p className="font-medium">링크로 추가하기</p>
              </div>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <Sheet open={openLink} onOpenChange={setOpenLink}>
        <SheetContent
          side="top"
          className="animate-slide-down w-full rounded-b-2xl pt-4 shadow-md [&>button.absolute]:hidden"
        >
          <SheetHeader className="m-0 gap-0 p-0">
            <SheetTitle className="m-0 gap-0 p-0"></SheetTitle>
            <SheetDescription className="m-0 gap-0 p-0"></SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4">
            <div className="grid">
              <div className="flex items-center space-x-2">
                <Input
                  id="product-link"
                  placeholder="쿠팡 상품 링크를 입력해주세요"
                  value={link}
                  onChange={handleLinkChange}
                  className={`flex-1 px-4 py-6 ${
                    linkError ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {linkError && (
                <p className="mt-2 flex items-center text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {linkError}
                </p>
              )}
            </div>
          </div>
          <SheetFooter>
            <Button
              type="button"
              onClick={handleAddLink}
              disabled={!link.trim()}
              className="w-full gap-2 px-4 py-6 text-xl"
            >
              추가하기
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 border-t bg-white shadow-inner">
        {/* 1. 찜 */}
        <button
          onClick={() => router.push("/mynow")}
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === "/mynow"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${pathname === "/mynow" ? "fill-current" : ""}`}
          />
          <span className="mt-1 text-xs">찜</span>
        </button>

        {/* 2. 카테고리 */}
        <button
          onClick={() => router.push("/categories")}
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === "/categories"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <LayoutGrid
            className={`h-5 w-5 ${
              pathname === "/categories" ? "fill-current" : ""
            }`}
          />
          <span className="mt-1 text-xs">카테고리</span>
        </button>

        {/* 3. 추가 버튼 (중앙) */}
        <button
          onClick={() => setOpen(true)}
          className="text-muted-foreground hover:text-primary flex flex-1 flex-col items-center justify-center"
        >
          <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg">
            <Plus className="h-6 w-6" />
          </div>
        </button>

        {/* 4. NOW */}
        <button
          onClick={() => router.push("/now")}
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === "/now"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Flame
            className={`h-5 w-5 ${pathname === "/now" ? "fill-current" : ""}`}
          />
          <span className="mt-1 text-xs">NOW</span>
        </button>

        {/* 5. 검색 */}
        <button
          onClick={() => router.push("/alarm")}
          className={`flex flex-1 flex-col items-center justify-center ${
            pathname === "/alarm"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Bell
            className={`h-5 w-5 ${pathname === "/alarm" ? "fill-current" : ""}`}
          />
          <span className="mt-1 text-xs">알람</span>
        </button>
      </nav>
    </>
  );
}
