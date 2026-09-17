import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
export const enableFirebaseMessaging = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log(":dart: Notification permission:", permission);
    if (permission !== "granted") {
      console.warn(":lock: Notification permission not granted.");
      return null;
    }
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("Service Worker Registration:", registration);


    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: "BCQmDKPZLRTlA4cyNMgdbT0MdaxRYgE79h-XWmPpF7WwFcNLr96DGxyK64WV0-E6PbR7z9XAznC7iT002IEIS6g", // :repeat: Replace with real one
      serviceWorkerRegistration: registration,
    });
    if (token) {
      console.log("✅ Push Token:", token);
      return token;
    } else {
      console.warn("⚠️ No token received.");
      return null;
    }
  } catch (err) {
    console.error("❌ Error getting push token:", err);
    return null;
  }
};






