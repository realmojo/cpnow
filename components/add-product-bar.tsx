"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";

export function AddProductBar() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      let targetUrl: URL;
      try {
        targetUrl = new URL(url);
      } catch {
        alert("올바른 URL을 입력해주세요.");
        setLoading(false);
        return;
      }

      let productId = "";
      const pathSegments = targetUrl.pathname.split("/");
      const productsIndex = pathSegments.indexOf("products");
      if (productsIndex !== -1 && pathSegments[productsIndex + 1]) {
        productId = pathSegments[productsIndex + 1];
      } else {
        // Try end of path if numeric (for some mobile link formats)
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (/^\d+$/.test(lastSegment)) {
          productId = lastSegment;
        }
      }

      const vendorItemId = targetUrl.searchParams.get("vendorItemId");

      if (!productId || !vendorItemId) {
        alert(
          "URL에서 상품 정보를 찾을 수 없습니다. (productId 또는 vendorItemId 누락)"
        );
        setLoading(false);
        return;
      }

      // API 호출하여 데이터 추출 및 저장 (서버사이드 트래킹 Trigger)
      const res = await fetch(
        `/api/track?productId=${productId}&vendorItemId=${vendorItemId}`
      );

      if (!res.ok) {
        throw new Error("Tracking API failed");
      }

      // 성공 시 메인 목록 갱신 및 상세 페이지로 이동
      router.refresh(); // 데이터 갱신
      router.push(`/product/${productId}/${vendorItemId}`);
    } catch (error) {
      console.error(error);
      alert("상품 정보를 분석하는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAnalyze}
      className="w-full max-w-2xl mx-auto flex gap-2 relative z-10"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="쿠팡 상품 URL을 입력하여 추적 시작..."
          className="pl-10 h-12 bg-white/80 dark:bg-black/50 backdrop-blur-md border-white/20 shadow-lg focus-visible:ring-primary/50 transition-all rounded-full"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="h-12 rounded-full px-6 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
        <span className="ml-2 hidden sm:inline">Add Item</span>
      </Button>
    </form>
  );
}
