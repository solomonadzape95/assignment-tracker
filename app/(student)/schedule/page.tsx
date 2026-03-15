import { redirect } from "next/navigation";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/auth";
import { ScheduleView } from "@/components/dashboard/ScheduleView";

export default async function SchedulePage() {
  const auth = await getCurrentUserAndProfile({ redirectIfUnauthed: true });

  if (!auth) {
    redirect("/");
  }

  if (isAdmin(auth)) {
    redirect("/admin");
  }

  if (!auth.profile || !auth.profile.student_id) {
    return (
      <main className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Schedule
          </h1>
          <p className="text-sm text-red-600">
            We could not link your account to a student record. Please contact
            your class administrator.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <ScheduleView studentId={auth.profile.student_id} />
    </main>
  );
}

