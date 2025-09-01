import * as admin from 'firebase-admin';
import { getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { ServiceAccount } from 'firebase-admin';

let app: admin.app.App;

try {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  app = !getApps().length
    ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    : getApp();
} catch (error) {
  console.warn('Firebase Admin SDK initialization failed. Some server-side features may not work. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.');
  // Create a placeholder app to avoid crashing the server if initialization fails
  if (!getApps().length) {
    app = admin.initializeApp();
  } else {
    app = getApp();
  }
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
