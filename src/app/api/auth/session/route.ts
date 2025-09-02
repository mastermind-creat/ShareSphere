import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SESSION_COOKIE_NAME = "__session";

// Handle login
export async function POST(request: NextRequest) {
  console.log("POST request received");
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: "error", message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.log("Auth error:", error?.message);
      return NextResponse.json(
        { status: "error", message: error?.message || "Failed to create session" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      status: "success",
      user: data.user,
    });

    response.cookies.set(SESSION_COOKIE_NAME, data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: "/",
    });

    console.log("Session cookie set");
    return response;
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle session check
export async function GET(request: NextRequest) {
  console.log("GET request received");
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "No session found" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      console.log("Session check error:", error?.message);
      return NextResponse.json(
        { status: "error", message: error?.message || "Invalid session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: "success",
      user: data.user,
    });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}