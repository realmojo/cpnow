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

if (isSupported) {
  // const userInfo = localStorage.getItem("cpnow-auth");
  // console.log(userInfo);
  console.log("백그라운드를 수신 합니다.1113333");
  messaging.onBackgroundMessage(function (payload) {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload,
    );

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon,
      data: {
        click_action: payload.fcmOptions?.link || "https://cpnow.kr",
      },
      tag: "test tag",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener("notificationclick", function (event) {
    console.log("알람 클릭됌");
    console.log(event);
    event.notification.close();
    event.waitUntil(
      clients.openWindow(
        event.notification.data?.click_action || "https://cpnow.kr",
      ),
    );
  });

  self.addEventListener("message", (event) => {
    if (event.data?.type === "AUTH_TOKEN") {
      console.log("🔐 클라이언트로부터 받은 데이터:", event.data);
      // 여기에 저장하거나 상태로 보관 가능
    }
  });
}
