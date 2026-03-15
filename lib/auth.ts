import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  auth_user_id: string;
  student_id: string | null;
  email: string;
}

export interface AuthContext {
  user: {
    id: string;
    email: string | null;
    user_metadata: Record<string, unknown>;
    role: string | null;
  };
  profile: Profile | null;
}

export async function getCurrentUserAndProfile(
  options: { redirectIfUnauthed?: boolean } = {}
): Promise<AuthContext | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (options.redirectIfUnauthed) {
      redirect("/sign-in");
    }
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, auth_user_id, student_id, email")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching profile", error);
  }

  let effectiveProfile = profile as Profile | null;

  // If no profile exists yet but the user has a student_id in their metadata,
  // create a profiles row to link auth user to seeded student record.
  if (!effectiveProfile && user.email) {
    const metadata = user.user_metadata ?? {};
    const studentId = (metadata.student_id as string | undefined) ?? null;

    if (studentId) {
      const { data: createdProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          auth_user_id: user.id,
          student_id: studentId,
          email: user.email,
        })
        .select("id, auth_user_id, student_id, email")
        .maybeSingle();

      if (insertError) {
        // eslint-disable-next-line no-console
        console.error("Error creating profile", insertError);
      } else {
        effectiveProfile = createdProfile as Profile | null;
      }
    }
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata ?? {},
      role:
        (user.user_metadata?.role as string | undefined) ??
        (user.user_metadata?.app_role as string | undefined) ??
        null,
    },
    profile: effectiveProfile,
  };
}

export function isAdmin(auth: AuthContext | null): boolean {
  if (!auth) return false;
  return auth.user.role === "admin";
}


