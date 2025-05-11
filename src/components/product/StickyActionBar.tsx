"use client";
import AlarmButton from "@/src/components/product/AlarmButton";

interface Props {
  productItem: any;
  getShortUrl: string;
}

export default function StickyActionBar({ productItem, getShortUrl }: Props) {
  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 w-full bg-white shadow-lg">
        <div className="mx-auto flex w-full max-w-[800px] flex-row">
          <a
            href={getShortUrl}
            target="_blank"
            className="flex h-14 w-1/2 items-center justify-center bg-blue-600 text-center text-sm font-bold text-white"
          >
            구매하기
          </a>
          <div className="w-1/2 bg-gray-800 text-center text-lg font-bold text-white">
            <AlarmButton pId={productItem.id} />
          </div>
        </div>
      </div>
    </>
  );
}
