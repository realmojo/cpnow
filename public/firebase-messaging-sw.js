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
  console.log("백그라운드를 수신 합니다.");
  messaging.onBackgroundMessage(function (payload) {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload,
    );

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "icons/android-icon-192x192.png",
      data: {
        click_action: payload.notification.click_action || "https://naver.com",
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener("notificationclick", function (event) {
    console.log("알람 클릭됌");
    console.log(event);
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.click_action));
  });
}
