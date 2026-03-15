import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/auth";
import { getAssignmentForStudentServer } from "@/services/assignments";
import { AssignmentDetailsView } from "@/components/dashboard/AssignmentDetailsView";

interface AssignmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentDetailsPage({
  params,
}: AssignmentDetailsPageProps) {
  const auth = await getCurrentUserAndProfile({ redirectIfUnauthed: true });
  const { id: slug } = await params;

  if (!auth || !auth.profile || !auth.profile.student_id) {
    redirect("/");
  }

  const assignment = await getAssignmentForStudentServer(
    slug,
    auth.profile.student_id
  );

  if (!assignment) {
    return (
      <main className="min-h-screen bg-background-light dark:bg-background-dark px-4 py-6 font-display text-slate-900 dark:text-slate-100">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          <p className="text-sm font-medium text-slate-900">
            Assignment not found
          </p>
          <p className="text-sm text-slate-500">
            This assignment may have been removed. Please return to your
            dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AssignmentDetailsView
        assignment={assignment}
        studentId={auth.profile.student_id}
      />
    </main>
  );
}
