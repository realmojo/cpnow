export const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear(); // 2025
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 01~12
  const day = String(today.getDate()).padStart(2, "0"); // 01~31

  return `${year}-${month}-${day}`;
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

export const sendNotificationTest = async () => {
  const permission = await Notification.requestPermission();
  alert(permission);
  if (permission === "granted") {
    const click_action = "https://cpnow.kr";
    new Notification("시피나우", {
      body: "등록하신 상품이 최저가로 올라왔습니다.",
      icon: "/icons/android-icon-512x512.png",
      data: {
        click_action, // ✅ 클릭 시 이동할 링크
      },
    }).onclick = (event) => {
      event.preventDefault();
      window.open(click_action, "_blank");
    };
  } else {
    alert("알림 권한이 필요합니다. 1");
  }
};

export const getUserAuth = () => {
  const item = localStorage.getItem("cpnow-auth") || "";

  if (item) {
    return JSON.parse(item);
  } else {
    return {
      userId: "",
      fcmToken: "",
    };
  }
};

export const fisrtCategories = [
  {
    categoryId: 564653,
    name: "패션의류/잡화",
  },
  {
    categoryId: 176522,
    name: "뷰티",
  },
  {
    categoryId: 221934,
    name: "출산/유아동",
  },
  {
    categoryId: 194276,
    name: "식품",
  },
  {
    categoryId: 185669,
    name: "주방용품",
  },
  {
    categoryId: 115673,
    name: "생활용품",
  },
  {
    categoryId: 184555,
    name: "홈인테리어",
  },
  {
    categoryId: 178255,
    name: "가전디지털",
  },
  {
    categoryId: 317778,
    name: "스포츠/레저",
  },
  {
    categoryId: 184060,
    name: "자동차용품",
  },
  {
    categoryId: 317777,
    name: "도서/음반/DVD",
  },
  {
    categoryId: 317779,
    name: "완구/취미",
  },
  {
    categoryId: 177295,
    name: "문구/오피스",
  },
  {
    categoryId: 115674,
    name: "반려동물용품",
  },
  {
    categoryId: 305798,
    name: "헬스/건강식품",
  },
];

export const getCategoryIdByName = (name: string) => {
  const category = fisrtCategories.find((item) => item.name === name);
  return category ? category.categoryId : null;
};
