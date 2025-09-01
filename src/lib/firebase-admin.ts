import * as admin from 'firebase-admin';
import { getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

const app = !getApps().length 
  ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
