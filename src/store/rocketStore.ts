import { create } from "zustand";
import { getGoldBox, getRocketItems } from "@/utils/api";

export const rocketStore = create<any>((set) => ({
  goldItems: [],
  rocketFreshItems: [],
  rocketItems: [],

  setGoldItems: async () => {
    const { data } = await getGoldBox();
    set({ goldItems: data });
  },

  setRocketFreshItems: async () => {
    const data = await getRocketItems("rocket_fresh");
    set({ rocketFreshItems: data });
  },

  setRocketItems: async () => {
    const data = await getRocketItems("rocket");
    set({ rocketItems: data });
  },
}));
