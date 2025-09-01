// Import Firebase app and messaging scripts
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "sharesphere-g27ie",
  appId: "1:650798428001:web:81535d7b9cf5042799df20",
  storageBucket: "sharesphere-g27ie.firebasestorage.app",
  apiKey: "AIzaSyCSHENk67H9nqiMNLH4hnTMVtWRVZO0oi8",
  authDomain: "sharesphere-g27ie.firebaseapp.com",
  messagingSenderId: "650798428001"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // You can add a default icon here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
