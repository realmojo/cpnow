// components/BottomTabBar.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Heart,
  Menu,
  Flame,
  LinkIcon,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getUserAuth } from "@/utils/utils";
import { toast } from "sonner";

export default function BottomTabBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false); // Drawer 상태
  const [link, setLink] = useState("");

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
        router.push("/mynow");
      } else {
        toast.error("상품 추가에 실패했습니다.");
      }

      // API 호출이나 상태 업데이트 등
      setLink(""); // 입력 필드 초기화
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
  }, [open]);

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[40%] rounded-t-2xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between text-xl font-semibold">
              상품 추가하기
            </DrawerTitle>
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

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:bg-muted w-full justify-start gap-3 px-4 py-6 text-left shadow-sm"
                >
                  <LinkIcon className="text-primary h-5 w-5" />
                  <div>
                    <p className="font-medium">링크로 추가하기</p>
                  </div>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>상품 링크 추가</DialogTitle>
                  <DialogDescription>
                    추가하고 싶은 상품의 링크를 입력해주세요.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        id="product-link"
                        placeholder="https://link.coupang.com/a/xxxxxx"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="sm:justify-between">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={handleAddLink}
                      disabled={!link.trim()}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      추가하기
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </DrawerContent>
      </Drawer>
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 border-t bg-white shadow-inner">
        {/* 1. 찜 */}
        <button
          onClick={() => router.push("/mynow")}
          className="text-muted-foreground hover:text-primary flex flex-1 flex-col items-center justify-center"
        >
          <Heart className="h-5 w-5" />
          <span className="mt-1 text-xs">찜</span>
        </button>

        {/* 2. 카테고리 */}
        <button
          onClick={() => router.push("/categories")}
          className="text-muted-foreground hover:text-primary flex flex-1 flex-col items-center justify-center"
        >
          <Menu className="h-5 w-5" />
          <span className="mt-1 text-xs">카테고리</span>
        </button>

        {/* 3. 중앙 공간 확보용 (실제 버튼은 아래에 오버레이) */}
        {/* <div className="flex flex-1 items-center justify-center">
          <Plus className="h-5 w-5 opacity-0" />
        </div> */}

        {/* 4. NOW */}
        <button
          onClick={() => router.push("/now")}
          className="text-muted-foreground hover:text-primary flex flex-1 flex-col items-center justify-center"
        >
          <Flame className="h-5 w-5" />
          <span className="mt-1 text-xs">NOW</span>
        </button>

        {/* 5. 검색 */}
        <button
          onClick={() => router.push("/search")}
          className="text-muted-foreground hover:text-primary flex flex-1 flex-col items-center justify-center"
        >
          <Search className="h-5 w-5" />
          <span className="mt-1 text-xs">검색</span>
        </button>

        {/* 중앙 floating + 버튼 */}
        <div className="absolute -top-6 left-1/2 z-50 -translate-x-1/2">
          <Button
            onClick={() => setOpen(true)}
            className="bg-primary flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-white shadow-xl"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </>
  );
}
