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
