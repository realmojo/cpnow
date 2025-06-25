import { create } from "zustand";

import { getSettings, updateSettings } from "@/utils/api";
import { getUserAuth } from "@/utils/utils";

export const settingsStore = create<any>((set, get) => ({
  settings: {},

  setSettings: async () => {
    const { userId } = getUserAuth();
    const data = await getSettings(userId);
    set({ settings: data });
  },

  updateSettings: async (column: string, value: string) => {
    const { settings } = get();
    settings[column] = value;

    const params = {
      isMyAlarm: settings?.isMyAlarm,
      isPriceAlarm: settings?.isPriceAlarm,
      isBlockAlarm: settings?.isBlockAlarm,
      blockStartTime: settings?.blockStartTime,
      blockEndTime: settings?.blockEndTime,
    };

    const { userId } = getUserAuth();
    const data = await updateSettings(userId, params);
    set({ settings: data });
  },
}));
