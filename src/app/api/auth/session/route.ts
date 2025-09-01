'use server';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const SESSION_COOKIE_NAME = '__session';

// Log in / create session
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.admin.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { status: 'error', message: error?.message || 'Failed to create session' },
        { status: 401 }
      );
    }

    // Set Supabase session cookie
    cookies().set(SESSION_COOKIE_NAME, data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 5, // 5 days in seconds
      path: '/',
    });

    return NextResponse.json({ status: 'success', user: data.user });
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// Log out / delete session
export async function DELETE() {
  try {
    // Clear cookie
    cookies().delete(SESSION_COOKIE_NAME, { path: '/' });

    // Optionally, revoke session server-side using Supabase
    // await supabaseAdmin.auth.admin.signOut(); // Not needed if cookie is enough

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to clear session:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to clear session' },
      { status: 500 }
    );
  }
}
