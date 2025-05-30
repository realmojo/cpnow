import { messaging, getToken } from "@/lib/firebase";
import {
  Soup,
  Sparkles,
  ShoppingBasket,
  CookingPot,
  Shirt,
  Baby,
  Home,
  Monitor,
  Dumbbell,
  Car,
  BookOpen,
  Puzzle,
  Pencil,
  PawPrint,
  HeartPulse,
} from "lucide-react";

export const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear(); // 2025
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 01~12
  const day = String(today.getDate()).padStart(2, "0"); // 01~31

  return `${year}-${month}-${day}`;
};

export const getDeliveryType = (src: string) => {
  if (!src) return 0;
  else if (src.includes("logo_rocket_large") || src.includes("rocket_logo"))
    return 1;
  else if (src.includes("logoRocketMerchant")) return 2;
  else if (src.includes("global_b")) return 3;
  else if (src.includes("rocket-fresh")) return 4;
  else if (src.includes("install")) return 5;
  else return 0;
};

export const detectDevice = () => {
  const ua = navigator.userAgent;
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // iPadOS 대응 (iPad가 데스크탑 Safari처럼 보일 수 있음)
  const isIPadPro =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return {
    isMobile: isMobile || isIPadPro,
    isDesktop: !(isMobile || isIPadPro),
    userAgent: ua,
  };
};

export const sendNotification = async () => {
  const auth = getUserAuth();
  const response = await fetch("/api/notify", {
    method: "POST",
    body: JSON.stringify({
      token: auth.fcmToken,
      title: "쿠팡 상품을 등록해 주세요🚀",
      body: "이제 알람을 받으실 수 있습니다.",
      icon: "https://cpnow.kr/icons/android-icon-48x48.png",
      link: "https://cpnow.kr",
    }),
  });

  return response;
};

export const refreshToken = async (messaging: any, isTest: boolean = false) => {
  if (!messaging) return;

  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  });

  const auth = getUserAuth();

  const cpnowInfo = {
    userId: auth.userId,
    fcmToken,
  };

  const res = await fetch("/api/token", {
    method: "PATCH",
    body: JSON.stringify(cpnowInfo),
  });

  if (res.ok) {
    console.log("🔐 토큰 갱신 완료");
    localStorage.setItem("cpnow-auth", JSON.stringify(cpnowInfo));
    if (isTest) {
      await sendNotification();
    }
  }
};

export const sendNotificationTest = async () => {
  const auth = getUserAuth();
  if (isWebView()) {
    await sendNotification();
  } else {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      if (auth.fcmToken) {
        try {
          const response = await sendNotification();

          const result = await response.json();
          if (!result.success) {
            // 토큰이 만료되서 갱신 후 다시 보냅니다.
            if (messaging) {
              refreshToken(messaging, true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert("알림 권한이 필요합니다.");
    }
  }
};

export const getUserAuth = () => {
  const item = localStorage.getItem("cpnow-auth") || "";
  if (item) {
    return JSON.parse(item || "{}");
  } else {
    return {
      userId: "",
      fcmToken: "",
    };
  }
};

export const setUserAuth = (cpnowInfo: any) => {
  localStorage.setItem("cpnow-auth", JSON.stringify(cpnowInfo));
};

export const fisrtCategories = [
  { categoryId: 194276, name: "식품", icon: Soup },
  { categoryId: 176522, name: "뷰티", icon: Sparkles },
  { categoryId: 115673, name: "생활용품", icon: ShoppingBasket },
  { categoryId: 185669, name: "주방용품", icon: CookingPot },
  { categoryId: 564653, name: "패션의류/잡화", icon: Shirt },
  { categoryId: 221934, name: "출산/유아동", icon: Baby },
  { categoryId: 184555, name: "홈인테리어", icon: Home },
  { categoryId: 178255, name: "가전디지털", icon: Monitor },
  { categoryId: 317778, name: "스포츠/레저", icon: Dumbbell },
  { categoryId: 184060, name: "자동차용품", icon: Car },
  { categoryId: 317777, name: "도서/음반/DVD", icon: BookOpen },
  { categoryId: 317779, name: "완구/취미", icon: Puzzle },
  { categoryId: 177295, name: "문구/오피스", icon: Pencil },
  { categoryId: 115674, name: "반려동물용품", icon: PawPrint },
  { categoryId: 305798, name: "헬스/건강식품", icon: HeartPulse },
];

export const getCategoryIdByName = (name: string) => {
  const category = fisrtCategories.find((item) => item.name === name);
  return category ? category.categoryId : null;
};

export const isWebView = () => {
  const isWebView = /wv|reactnative|react-native/i.test(navigator.userAgent);
  return isWebView;
};

export const extractRedirectUrlFromHtml = (html: string) => {
  const regex = /var\s+redirectWebUrl\s*=\s*['"]([^'"]+)['"]/;
  const match = html.match(regex);

  if (match && match[1]) {
    // JS 이스케이프 해제 (예: \x3A → :)
    const raw = match[1];
    const decoded = unescape(raw.replace(/\\x/g, "%"));
    return decoded;
  }

  return null;
};

export const extractCoupangParams = (url: string) => {
  const u = new URL(url);
  const params = u.searchParams;

  return {
    productId: params.get("pageValue"), // 또는 아래 path에서 추출 가능
    itemId: params.get("itemId"),
    vendorItemId: params.get("vendorItemId"),
  };
};

// 쿠팡 링크 유효성 검사 함수
export const validateCoupangLink = (url: string) => {
  if (!url.trim()) {
    return "";
  }

  const isValidCoupangLink = url.includes("coupang");

  if (!isValidCoupangLink) {
    return "유효한 쿠팡 링크를 입력해주세요.";
  }

  return "";
};
