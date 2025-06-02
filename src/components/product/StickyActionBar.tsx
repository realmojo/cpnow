"use client";
import AlarmButton from "@/src/components/product/AlarmButton";
import { ShoppingCartIcon } from "lucide-react";
interface Props {
  productItem: any;
  getShortUrl: string;
}

export default function StickyActionBar({ productItem, getShortUrl }: Props) {
  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 w-full bg-white shadow-lg">
        <div className="mx-auto flex w-full max-w-[800px] flex-row">
          {/* 구매하기 버튼 (80%) */}
          <a
            href={getShortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-16 w-4/5 items-center justify-center bg-blue-600 text-center text-lg font-bold text-white transition-colors hover:bg-blue-700"
          >
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            구매하기
          </a>

          {/* 알림 버튼 (20%) */}
          <button
            type="button"
            className="rounded-0 bg-primary flex h-16 w-1/5 items-center justify-center text-center text-lg font-bold text-white transition-colors"
          >
            <AlarmButton productItem={productItem} />
          </button>
        </div>
      </div>
    </>
  );
}
