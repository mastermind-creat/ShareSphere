'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
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

    // Verify Supabase session
    const { data: { user }, error: sessionError } = await supabaseAdmin.auth.getUser(sessionCookie);
    if (sessionError || !user) {
      return { error: 'Session invalid or expired. Please sign in again.' };
    }

    // Fetch user profile to get Drive access token
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('drive_access_token')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return { error: 'User profile not found.' };
    }

    const accessToken = userData.drive_access_token;
    if (!accessToken) {
      return { error: 'Google Drive access token not found. Please re-authenticate with Google.' };
    }

    // Initialize Google OAuth client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // List files
    const res = await drive.files.list({
      pageSize: 20,
      fields: 'nextPageToken, files(id, name, mimeType)',
      orderBy: 'modifiedTime desc',
    });

    const files = res.data.files;
    if (!files || files.length === 0) {
      return { files: [] };
    }

    return {
      files: files.map(file => ({
        id: file.id || '',
        name: file.name || 'Untitled',
        mimeType: file.mimeType || 'unknown',
      })),
    };

  } catch (error: any) {
    console.error('Error listing Google Drive files:', error);

    if (error.response?.data?.error === 'invalid_grant') {
      return { error: 'Access token expired or revoked. Please sign in again with Google.' };
    }

    return { error: 'An unexpected error occurred while trying to fetch your Google Drive files.' };
  }
}
