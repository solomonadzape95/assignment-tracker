import { supabaseBrowserClient } from "@/lib/supabase/client";
import type { AssignmentDetail } from "@/types/assignments";

export async function markAssignmentCompletedClient(
  assignmentId: string,
  studentId: string
): Promise<void> {
  if (!supabaseBrowserClient) {
    throw new Error("Supabase client is not configured.");
  }

  const { error } = await supabaseBrowserClient
    .from("assignment_status")
    .upsert({
      assignment_id: assignmentId,
      student_id: studentId,
      status: "completed",
      completed_at: new Date().toISOString(),
    });

  if (error) {
    throw error;
  }
}

// Re-export type for convenience in client components
export type { AssignmentDetail } from "@/types/assignments";

