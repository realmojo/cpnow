"use client";
import { Suspense } from "react";
import SearchModalClient from "./SearchModalClient";

export default function SearchModalPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-white">모달 로딩중...</div>
      }
    >
      <SearchModalClient />
    </Suspense>
  );
}
