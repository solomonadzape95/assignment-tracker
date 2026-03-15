 "use client";

 import Link from "next/link";
 import { usePathname, useRouter } from "next/navigation";
 import { Icon } from "@/components/common/Icon";

export function DashboardBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isOnDashboard = pathname === "/dashboard";
  const isOnSchedule = pathname === "/schedule";
  const isOnStats = pathname === "/stats";

  async function handleLogout() {
    try {
      await fetch("/logout", { method: "POST" });
    } finally {
      router.replace("/");
    }
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10"
      aria-label="Main navigation"
    >
      <div className="max-w-2xl mx-auto flex gap-2 px-4 pb-6 pt-2">
        <Link
          href="/dashboard"
          className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl ${
            isOnDashboard
              ? "text-primary"
              : "text-slate-400 hover:text-primary transition-colors"
          }`}
        >
          <Icon name="home" size={26} />
          <p className="text-[10px] font-bold uppercase tracking-tighter">
            Home
          </p>
        </Link>
        <Link
          href="/schedule"
          className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl ${
            isOnSchedule
              ? "text-primary"
              : "text-slate-400 hover:text-primary transition-colors"
          }`}
        >
          <Icon name="calendar_month" size={26} />
          <p className="text-[10px] font-bold uppercase tracking-tighter">
            Schedule
          </p>
        </Link>
        <Link
          href="/stats"
          className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl ${
            isOnStats
              ? "text-primary"
              : "text-slate-400 hover:text-primary transition-colors"
          }`}
        >
          <Icon name="bar_chart" size={26} />
          <p className="text-[10px] font-bold uppercase tracking-tighter">
            Stats
          </p>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl text-red-500 hover:text-red-400 transition-colors"
        >
          <Icon name="logout" size={24} />
          <p className="text-[10px] font-bold uppercase tracking-tighter">
            Logout
          </p>
        </button>
      </div>
    </nav>
  );
}
