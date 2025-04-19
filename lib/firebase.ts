// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-UWwoyxQBNKq0LGtsLiDoReDDPrVFWu8",
  authDomain: "cpnow-5bb1e.firebaseapp.com",
  projectId: "cpnow-5bb1e",
  storageBucket: "cpnow-5bb1e.firebasestorage.app",
  messagingSenderId: "906287232914",
  appId: "1:906287232914:web:c628b842df888ddb6df34b",
  measurementId: "G-YL7EGJ74DV",
};

let messaging: ReturnType<typeof getMessaging> | null = null;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("자동로딩롣ㅇ");
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
      console.log(messaging);
      console.log("✅ Firebase Messaging Init");
    } else {
      console.warn("⚠️ 이 브라우저는 FCM을 지원하지 않습니다.");
    }
  });
}

export { messaging, getToken, onMessage };
