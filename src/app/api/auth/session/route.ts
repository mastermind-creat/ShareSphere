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

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
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
    const cookieStore = cookies();
    // cookies() returns ReadonlyRequestCookies in route handlers, which does not have .set or .delete.
    // To set a cookie, use NextResponse and its cookies API.

    const response = NextResponse.json({ status: 'success', user: data.user });
    response.cookies.set(SESSION_COOKIE_NAME, data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 5, // 5 days in seconds
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
