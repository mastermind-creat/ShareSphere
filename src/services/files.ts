'use server';
/**
 * @fileoverview Service for interacting with the files collection in Firestore.
 */

import { db } from '@/lib/firebase-admin';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';

export interface FileDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  ownerId: string;
  createdAt: { seconds: number; nanoseconds: number; };
  storage: 'firebase' | 'drive';
}

/**
 * Retrieves all files owned by the currently authenticated user.
 * @returns {Promise<FileDocument[]>} A promise that resolves to an array of file documents.
 */
export async function getUserFiles(): Promise<FileDocument[]> {
  const sessionCookie = cookies().get('__session')?.value;
  if (!sessionCookie) {
    throw new Error('Authentication required.');
  }

  const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
  const userId = decodedToken.uid;

  const filesSnapshot = await db.collection('files').where('ownerId', '==', userId).get();
  
  if (filesSnapshot.empty) {
    return [];
  }

  return filesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as FileDocument));
}
