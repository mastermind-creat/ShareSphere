// firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyByEk-wABTzJs7yDTjsFn1iaQfE1j4rkrg",
  authDomain: "ssphere-37bb4.firebaseapp.com",
  projectId: "ssphere-37bb4",
  storageBucket: "ssphere-37bb4.appspot.com",
  messagingSenderId: "445655538309",
  appId: "1:445655538309:web:e8d86bc17e2620d0c427ec",
  measurementId: "G-0F88THJT5H",
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const messaging = getMessaging(app);
