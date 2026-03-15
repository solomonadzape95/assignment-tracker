"use client";

import { useMemo } from "react";
import { useAssignments } from "@/hooks/useAssignments";

interface StatsViewProps {
  studentId: string;
}

function computeStreak(completedDates: Date[]): number {
  if (completedDates.length === 0) return 0;

  const uniqueDays = new Set(
    completedDates.map((d) => d.toISOString().slice(0, 10)),
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Walk backwards from today, counting consecutive days with completions.
  while (true) {
    const key = today.toISOString().slice(0, 10);
    if (!uniqueDays.has(key)) break;
    streak += 1;
    today.setDate(today.getDate() - 1);
  }

  return streak;
}

export function StatsView({ studentId }: StatsViewProps) {
  const { assignments, loading, error } = useAssignments(studentId);

  const { total, completed, pending, completionRate, streakDays, weeklyBuckets } =
    useMemo(() => {
      const totalAssignments = assignments.length;
      const completedAssignments = assignments.filter(
        (a) => a.status === "completed",
      );
      const pendingAssignments = totalAssignments - completedAssignments.length;

      const completionRatePercent =
        totalAssignments === 0
          ? 0
          : Math.round((completedAssignments.length / totalAssignments) * 100);

      const completedDates = completedAssignments
        .map((a) => (a.completed_at ? new Date(a.completed_at) : null))
        .filter((d): d is Date => d !== null);

      const streak = computeStreak(completedDates);

      const buckets: { label: string; count: number }[] = [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      for (let i = 6; i >= 0; i -= 1) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const key = day.toISOString().slice(0, 10);
        const count = completedDates.filter((d) => {
          const dKey = d.toISOString().slice(0, 10);
          return dKey === key;
        }).length;
        buckets.push({
          label: day.toLocaleDateString(undefined, { weekday: "short" }),
          count,
        });
      }

      return {
        total: totalAssignments,
        completed: completedAssignments.length,
        pending: pendingAssignments,
        completionRate: completionRatePercent,
        streakDays: streak,
        weeklyBuckets: buckets,
      };
    }, [assignments]);

  if (loading) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Loading statistics…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        High-level overview of your assignment progress, completion rate, and
        streaks. This view follows the same compact card style as the dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Completed
          </p>
          <p className="mt-2 text-2xl font-black">{completed}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Out of {total} assignments
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pending
          </p>
          <p className="mt-2 text-2xl font-black">{pending}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {completionRate}% complete
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Streak
          </p>
          <p className="mt-2 text-2xl font-black">
            {streakDays} {streakDays === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            With at least one completion
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Weekly trend
          </p>
        </div>
        <div className="flex items-end gap-2 h-24">
          {weeklyBuckets.map((bucket) => {
            const height = bucket.count === 0 ? 4 : 8 + bucket.count * 8;
            return (
              <div
                key={bucket.label}
                className="flex flex-1 flex-col items-center justify-end gap-1"
              >
                <div
                  className="w-3 rounded-full bg-primary/30 dark:bg-primary/60"
                  style={{ height }}
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {bucket.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          Bars show how many assignments you completed each day in the last 7
          days.
        </p>
      </div>
    </>
  );
}

