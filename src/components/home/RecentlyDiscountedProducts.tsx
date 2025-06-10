"use client";
import { useCallback, useEffect } from "react";
import ProductList from "../ProductList";
import { nowStore } from "@/src/store/nowStore";

export default function RecentlyDiscountedProducts() {
  const { nowItems, setNowItems } = nowStore();

  const initData = useCallback(async () => {
    if (nowItems.length === 0) {
      setNowItems();
    }
  }, [nowItems, setNowItems]);

  useEffect(() => {
    initData();
  }, [initData]);

  return <ProductList items={nowItems} type="grid" />;
}
