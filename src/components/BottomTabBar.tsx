// components/BottomTabBar.tsx
"use client";
import { useState } from "react";
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
import axios from "axios";
import { getUserAuth } from "@/utils/utils";
import { toast } from "sonner";
const extractRedirectUrlFromHtml = (html: string) => {
  const regex = /var\s+redirectWebUrl\s*=\s*['"]([^'"]+)['"]/;
  const match = html.match(regex);

  if (match && match[1]) {
    // JS 이스케이프 해제 (예: \x3A → :)
    const raw = match[1];
    const decoded = unescape(raw.replace(/\\x/g, "%"));
    return decoded;
  }

  return null;
};

const extractCoupangParams = (url: string) => {
  const u = new URL(url);
  const params = u.searchParams;

  return {
    productId: params.get("pageValue"), // 또는 아래 path에서 추출 가능
    itemId: params.get("itemId"),
    vendorItemId: params.get("vendorItemId"),
  };
};

export default function BottomTabBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false); // Drawer 상태
  const [link, setLink] = useState("");

  const handleAddLink = async () => {
    if (link.trim()) {
      // 여기서 링크 추가 로직 처리
      console.log("추가된 링크:", link);

      const response = await axios.get(link, {
        maxRedirects: 0, // 리디렉션 따라가지 않음
        validateStatus: (status) => status >= 200 && status < 400, // 3xx 응답도 허용
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        },
      });

      // const cookie = response.headers["set-cookie"];
      const redirectedUrl = extractRedirectUrlFromHtml(response.data);
      const { productId, itemId, vendorItemId } = extractCoupangParams(
        redirectedUrl ?? "",
      );

      const cpnowAuth = await getUserAuth();
      const userId = cpnowAuth.userId;
      console.log(userId, productId, itemId, vendorItemId);

      const { data } = await axios.post(
        `/api/product/piv/add`,
        {
          userId,
          productId,
          itemId,
          vendorItemId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (data.success) {
        toast.success("상품이 추가되었습니다.");
      } else {
        toast.error("상품 추가에 실패했습니다.");
      }

      // API 호출이나 상태 업데이트 등
      setLink(""); // 입력 필드 초기화
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[30%] rounded-t-2xl">
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
          onClick={() => router.push("/")}
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
        <div className="pointer-events-none flex flex-1 items-center justify-center">
          {/* 비워두거나 아이콘 자리를 맞춰주는 더미 */}
        </div>

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
