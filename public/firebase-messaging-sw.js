importScripts(
  "https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js",
);
firebase.initializeApp({
  apiKey: "AIzaSyC-UWwoyxQBNKq0LGtsLiDoReDDPrVFWu8",
  authDomain: "cpnow-5bb1e.firebaseapp.com",
  projectId: "cpnow-5bb1e",
  storageBucket: "cpnow-5bb1e.firebasestorage.app",
  messagingSenderId: "906287232914",
  appId: "1:906287232914:web:c628b842df888ddb6df34b",
  measurementId: "G-YL7EGJ74DV",
});

const messaging = firebase.messaging();
const isSupported = firebase.messaging.isSupported();

if (messaging && isSupported) {
  console.log("✅ SW 백그라운드를 수신 합니다.v1.0.18");
  messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message", payload);

    if (payload.data?.silent === "true" && payload.data?.check === "validity") {
      console.log("🔐 B 토큰 유효성 검사 완료");
      return;
    }

    const notificationTitle = payload.data?.title || "";
    const notificationOptions = {
      body: payload.data?.body || "",
      icon:
        payload.data?.icon || "https://cpnow.kr/icons/android-icon-48x48.png",
      requireInteraction: true,
      data: {
        click_action: payload.data?.link || "https://cpnow.kr",
      },
      image: payload.data?.image || "",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(
        event.notification.data?.click_action || "https://cpnow.kr",
      ),
    );
  });

  self.addEventListener("install", (event) => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
}
