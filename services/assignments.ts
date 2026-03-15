import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AssignmentDetail } from "@/types/assignments";

export async function getAssignmentForStudentServer(
  slug: string,
  studentId: string
): Promise<AssignmentDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("assignments")
    .select(
      "id, title, description, course_code, deadline, slug, assignment_status(status, completed_at, student_id)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching assignment", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  const statusRow =
    (data.assignment_status || []).find(
      (s: any) => s.student_id === studentId
    ) ?? null;

  const status = statusRow?.status ?? "pending";

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    course_code: data.course_code,
    deadline: data.deadline,
    slug: data.slug,
    status,
    completed_at: statusRow?.completed_at ?? null,
  };
}
