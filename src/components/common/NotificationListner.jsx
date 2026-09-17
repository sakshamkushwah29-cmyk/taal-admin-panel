// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// // import { messaging, onMessage } from "@/services/firebase";
// import { showToast } from "@/components/_ui/toast-utils";
// import { useNotifications } from "@/contexts/NotificationContext";

// export default function NotificationListener({ playSound = true }) {
//   const router = useRouter();
//   const { addNotification } = useNotifications();


//     // Notification sound
//     // const notificationAudio = typeof window !== 'undefined' ? new Audio('/notification.wav') : null;

//     // console.log(notificationAudio,"notification audio coming==============")

    

//   useEffect(() => {
//     if (!messaging) return;

//     const unsubscribe = onMessage(messaging, (payload) => {

//       console.log('[Service Worker] Received foreground message====:', payload);
//       console.log('Notification Payload:', payload.notification); // Log the notification part
//       const { title, body } = payload.notification || {};
      
//       let data;
//       if (payload.data?._doc) {
//         try {
//           data = JSON.parse(payload.data._doc);
//         } catch (e) {
//           console.error("Failed to parse notification _doc, using data as fallback", e);
//           data = payload.data;
//         }
//       } else {
//         data = payload.data || {};
//       }

//       const image = data.image || "/favicon.ico";
//       const path = data.NotificationPath;
//       const click_action = data.click_action;

//       console.log("Notification data:", data);
//       console.log("Notification Title:", title, "Body:", body); // Log title and body

//       if (!title || !body) {
//         console.warn("Notification has no title or body, skipping.");
//         return;
//       }

//       // Construct notification object for context
//       const notificationObj = {
//         _id: data.notificationId || Date.now().toString(), 
//         title,
//         message: body,
//         status: "unread",
//         sentAt: new Date().toISOString(),
//         image,
//         path,
//         click_action,
//         // ...add other fields if needed
//       };
//       addNotification(notificationObj);

//       if (Notification.permission === "granted") {
//         try {
//           const notification = new Notification(title, {
//             body,
//             icon: image,
//           });
//           notification.onclick = (event) => {
//             event.preventDefault();
//             notification.close();
//             if (path) {
//               window.location.href = path;
//             } else if (click_action) {
//               window.open(click_action, "_blank");
//             }
//           };
//         } catch (err) {
//           console.error("Notification error:", err);
//         }
//       } else {
//         showToast("success", body);
//         if (path) router.push(path);
//       }

//           // Play notification sound if enabled
//           if (playSound && notificationAudio) {
//             notificationAudio.currentTime = 0;
//             notificationAudio.play().catch(() => {});
//           }
//     });

//     return () => unsubscribe();
//   }, [router, addNotification, playSound]);

//   return null;
// }


