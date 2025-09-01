'use server';
/**
 * @fileoverview Service for interacting with the files table in Supabase.
 */

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';

export interface FileDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  ownerId: string;
  createdAt: string; // ISO string from Supabase timestamp
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

  // Verify Supabase session
  const { data: { user }, error: sessionError } = await supabaseAdmin.auth.getUser(sessionCookie);
  if (sessionError || !user) {
    throw new Error('Invalid or expired session. Please log in again.');
  }

  // Fetch files owned by user
  const { data: files, error } = await supabaseAdmin
    .from('files')
    .select('*')
    .eq('ownerId', user.id)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching user files:', error);
    throw new Error('Failed to fetch files.');
  }

  // Map Supabase timestamp to string if needed
  return (files || []).map(file => ({
    ...file,
    createdAt: file.createdAt.toISOString(),
  })) as FileDocument[];
}
