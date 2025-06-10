import { create } from "zustand";

export const nowStore = create<any>((set) => ({
  nowItems: [],

  setNowItems: async () => {
    const response = await fetch("/api/productPrice");
    const data = await response.json();
    set({ nowItems: data });
  },
}));
