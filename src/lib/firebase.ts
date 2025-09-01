import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "sharesphere-g27ie",
  appId: "1:650798428001:web:81535d7b9cf5042799df20",
  storageBucket: "sharesphere-g27ie.firebasestorage.app",
  apiKey: "AIzaSyCSHENk67H9nqiMNLH4hnTMVtWRVZO0oi8",
  authDomain: "sharesphere-g27ie.firebaseapp.com",
  messagingSenderId: "650798428001"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
