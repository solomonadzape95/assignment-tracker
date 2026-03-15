import { redirect } from "next/navigation";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/auth";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { Icon } from "@/components/common/Icon";
import { StatsView } from "@/components/dashboard/StatsView";

export default async function StatsPage() {
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
            Stats
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
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Icon name="bar_chart" size={24} className="text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Statistics</h1>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto pb-24">
        <div className="mx-auto w-full max-w-2xl px-4 py-6 space-y-5">
          <StatsView studentId={auth.profile.student_id} />
        </div>
      </section>

      <DashboardBottomNav />
    </main>
  );
}

