// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyBJ9ZuioejZ3wkPOpJYD4k3YBxXfYv91pI",
//   authDomain: "medlivurr.firebaseapp.com",
//   projectId: "medlivurr",
//   storageBucket: "medlivurr.firebasestorage.app",
//   messagingSenderId: "850444063238",
//   appId: "1:850444063238:web:97110e24b97fad0e4aa987",
//   measurementId: "G-DQ26HTR2YX"

// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {

//   let notificationPath = '/';
//   try {
//     if (payload.data?._doc) {
//       const doc = JSON.parse(payload.data._doc);
//       notificationPath = doc.NotificationPath || '/';
//     }
//   } catch (e) {
//     console.error('Error parsing _doc:', e);
//   }

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/firebase-logo.png",
//     data: { path: notificationPath },
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   const targetPath = event.notification.data?.path || "/";

//   event.waitUntil(
//     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//       for (const client of clientList) {
//         if ("focus" in client) {
//           client.navigate(targetPath);
//           return client.focus();
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow(targetPath);
//       }
//     })
//   );
// });


