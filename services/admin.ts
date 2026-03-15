import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface SimpleAssignment {
  id: string;
  title: string;
  description: string;
  course_code: string;
  deadline: string;
  created_at: string;
}

export async function getAllAssignmentsServer(): Promise<SimpleAssignment[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("id, title, description, course_code, deadline, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching assignments for admin", error);
    throw error;
  }

  return (data ?? []) as SimpleAssignment[];
}

export interface UpdateAssignmentPayload {
  title?: string;
  course_code?: string;
  description?: string;
  deadline?: string;
}

export async function updateAssignmentServer(
  id: string,
  payload: UpdateAssignmentPayload
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("assignments").update(payload).eq("id", id);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating assignment", error);
    throw error;
  }
}

export async function deleteAssignmentServer(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("assignments").delete().eq("id", id);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting assignment", error);
    throw error;
  }
}

