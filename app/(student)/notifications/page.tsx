import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { markAllNotificationsReadServer } from "@/services/notifications";

export default async function NotificationsPage() {
  const auth = await getCurrentUserAndProfile({ redirectIfUnauthed: true });

  if (!auth) {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, created_at, read_at, assignment_id")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error loading notifications", error);
  }

  const notifications =
    (data as {
      id: string;
      title: string;
      created_at: string;
      read_at: string | null;
      assignment_id: string | null;
    }[]) ?? [];

  await markAllNotificationsReadServer(auth.user.id);

  return (
    <main className="min-h-screen bg-background-dark font-display text-slate-100 px-4 py-6">
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
        </header>
        <section className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400">
              You have no notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-4"
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

