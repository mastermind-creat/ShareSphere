'use server';

import { auth } from '@/lib/firebase-admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { google } from 'googleapis';

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

type DriveFileListResult = {
  files?: DriveFile[];
  error?: string;
}

export async function listDriveFiles(): Promise<DriveFileListResult> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    
    if (!sessionCookie) {
      return { error: 'Not authenticated. Please sign in.' };
    }
    
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;
    
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { error: 'User profile not found.' };
    }

    const userData = userDoc.data();
    const accessToken = userData?.driveAccessToken;

    if (!accessToken) {
      return { error: 'Google Drive access token not found. Please re-authenticate with Google.' };
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    const res = await drive.files.list({
      pageSize: 20,
      fields: 'nextPageToken, files(id, name, mimeType)',
      orderBy: 'modifiedTime desc',
    });
    
    const files = res.data.files;
    if (!files || files.length === 0) {
      return { files: [] };
    }
    
    return { files: files.map(file => ({
      id: file.id || '',
      name: file.name || 'Untitled',
      mimeType: file.mimeType || 'unknown'
    }))};

  } catch (error: any) {
    console.error('Error listing Google Drive files:', error);

    if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/session-cookie-revoked') {
       return { error: 'Session expired. Please sign in again.' };
    }
     if (error.response?.data?.error === 'invalid_grant') {
      return { error: 'Access token expired or revoked. Please sign in again with Google.' };
    }

    return { error: 'An unexpected error occurred while trying to fetch your Google Drive files.' };
  }
}
