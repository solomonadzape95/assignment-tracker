import type { AssignmentStatusValue } from "@/hooks/useAssignments";

export interface AssignmentDetail {
  id: string;
  title: string;
  description: string;
  course_code: string;
  deadline: string;
  slug: string;
  status: AssignmentStatusValue;
  completed_at: string | null;
}

