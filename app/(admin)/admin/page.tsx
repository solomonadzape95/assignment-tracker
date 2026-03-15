import { getCurrentUserAndProfile, isAdmin } from "@/lib/auth";
import { getAllAssignmentsServer } from "@/services/admin";
import { AssignmentForm } from "@/components/admin/AssignmentForm";
import { AdminAssignmentsTable } from "@/components/admin/AdminAssignmentsTable";
import { Icon } from "@/components/common/Icon";

export default async function AdminPage() {
  const auth = await getCurrentUserAndProfile({ redirectIfUnauthed: true });

  if (!auth || !isAdmin(auth)) {
    return (
      <main className="min-h-screen bg-background-dark px-4 py-6 font-display text-slate-100">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <p className="text-sm font-medium text-slate-100">
            You do not have access to this page.
          </p>
          <p className="text-sm text-slate-400">
            Only administrators can create assignments. If you believe this is a
            mistake, contact your system administrator.
          </p>
        </div>
      </main>
    );
  }

  const assignments = await getAllAssignmentsServer();

  return (
    <main className="min-h-screen bg-background-dark font-display text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6 flex flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/40">
              <Icon name="school" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                Admin panel
              </h1>
              <p className="text-sm text-slate-400">
                Create and manage assignments for your class.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
          <h2 className="text-slate-100 text-lg font-bold mb-4 flex items-center gap-2">
            <Icon name="add" size={22} className="text-primary" />
            New assignment
          </h2>
          <AssignmentForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-slate-100 text-lg font-bold flex items-center gap-2">
            <Icon name="assignment" size={22} className="text-primary" />
            Existing assignments
          </h2>
          <AdminAssignmentsTable initialAssignments={assignments} />
        </section>
      </div>
    </main>
  );
}
