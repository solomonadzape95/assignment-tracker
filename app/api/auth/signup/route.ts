import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // This will surface clearly in logs if misconfigured
  // but avoid throwing at import time in production builds.
  // We instead validate inside the handler.
}

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Auth signup is not configured on the server." },
        { status: 500 }
      );
    }

    const { email, password, studentId, studentName } = await request.json();

    if (!email || !password || !studentId || !studentName) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data,
      error: signUpError,
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        student_id: studentId,
        full_name: studentName,
      },
      app_metadata: {
        role: "student",
      },
    });

    if (signUpError || !data.user) {
      return NextResponse.json(
        { error: signUpError?.message ?? "Failed to create user." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Signup route error", error);
    return NextResponse.json(
      { error: "Something went wrong while creating your account." },
      { status: 500 }
    );
  }
}

