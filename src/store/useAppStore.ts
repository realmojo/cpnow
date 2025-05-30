import { create } from "zustand";

interface AppState {
  loginInfo: any; // 또는 loginInfo: { userId: string; name: string; ... }
  myAlarmList: any[];
  setLoginInfo: (info: any) => void;
  getMyAlarmList: () => Promise<void>;
  setMyAlarmList: (item: any) => Promise<void>;
  open: boolean;
  openLink: boolean;
  setOpen: (open: boolean) => void;
  setOpenLink: (openLink: boolean) => void;
  toggleOpen: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  loginInfo: (() => {
    const authStr =
      typeof window !== "undefined" ? localStorage.getItem("cpnow-auth") : null;
    return authStr ? JSON.parse(authStr) : {};
  })(), // 최초 초기값에서 로컬스토리지 불러오기
  myAlarmList: [],

  setLoginInfo: (info) => set({ loginInfo: info }),

  getMyAlarmList: async () => {
    const { userId } = get().loginInfo;

    if (!userId) return;

    const res = await fetch(`/api/userAlarm/my?userId=${userId}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      set({ myAlarmList: data.reverse() });
      return data.reverse();
    }
    return [];
  },
  setMyAlarmList: async (item: any) => {
    const { myAlarmList } = get();
    set({ myAlarmList: [item, ...myAlarmList] });
  },
  open: false,
  openLink: false,
  setOpen: (open) => set({ open }),
  setOpenLink: (openLink) => set({ openLink }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));
