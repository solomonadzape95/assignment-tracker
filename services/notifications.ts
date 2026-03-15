import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  assignment_id: string | null;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

export async function createAssignmentNotificationsServer(
  assignmentId: string,
  assignmentTitle: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("auth_user_id")
    .not("student_id", "is", null);

  if (profilesError) {
    // eslint-disable-next-line no-console
    console.error("Error fetching profiles for notifications", profilesError);
    throw profilesError;
  }

  if (!profiles || profiles.length === 0) return;

  const rows = profiles.map((p) => ({
    user_id: p.auth_user_id,
    type: "assignment_created",
    assignment_id: assignmentId,
    title: `New assignment: ${assignmentTitle}`,
    body: null,
  }));

  const { error: insertError } = await supabase
    .from("notifications")
    .insert(rows);

  if (insertError) {
    // eslint-disable-next-line no-console
    console.error("Error inserting notifications", insertError);
    throw insertError;
  }
}

export async function markAllNotificationsReadServer(
  userId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null)
    .eq("user_id", userId);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error marking notifications as read", error);
    throw error;
  }
}

