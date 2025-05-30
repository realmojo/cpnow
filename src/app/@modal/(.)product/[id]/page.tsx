"use client";
import { use, Suspense } from "react";
import ProductModalClient from "./ProductModalClient";

export default function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-white">모달 로딩중...</div>
      }
    >
      <ProductModalClient id={id} />
    </Suspense>
  );
}
