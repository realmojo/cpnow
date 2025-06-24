import { create } from "zustand";

export const nowStore = create<any>((set) => ({
  nowItems: [],

  setNowItems: async (sortOption: string) => {
    const response = await fetch("/api/productPrice");
    const data = await response.json();
    const items = data.map((item: any) => {
      return {
        ...item,
        discount: item.highPrice - item.price,
        priceDifference: item.highPrice - item.price,
        discountPercent: (
          ((item.highPrice - item.price) / item.highPrice) *
          100
        ).toFixed(0),
        increasePercent: (
          ((item.price - item.lowPrice) / item.lowPrice) *
          100
        ).toFixed(0),
      };
    });
    // set({ nowItems: data });
    if (sortOption === "recently") {
      set({ nowItems: items });
    } else if (sortOption === "priceLow") {
      set({ nowItems: items.sort((a: any, b: any) => a.price - b.price) });
    } else if (sortOption === "priceHigh") {
      set({ nowItems: items.sort((a: any, b: any) => b.price - a.price) });
    } else if (sortOption === "discount") {
      set({
        nowItems: items.sort(
          (a: any, b: any) => b.discountPercent - a.discountPercent,
        ),
      });
    }
  },
}));
