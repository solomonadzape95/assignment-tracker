"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignments } from "@/hooks/useAssignments";
import { getTimeRemaining } from "@/utils/dates";
import type { Student } from "@/services/students";
import { AssignmentCard } from "@/components/dashboard/AssignmentCard";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { Icon } from "@/components/common/Icon";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsModal } from "@/components/dashboard/NotificationsModal";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

interface DashboardViewProps {
  studentId: string;
  student: Student | null;
}

function getInitials(fullname: string): string {
  return fullname
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

export function DashboardView({ studentId, student }: DashboardViewProps) {
  const router = useRouter();
  const { assignments, loading, error, progress } = useAssignments(studentId);
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    markAllAsRead,
  } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const dueIn48h =
    assignments.filter((a) => {
      if (a.status === "completed") return false;
      const r = getTimeRemaining(a.deadline);
      return r.totalMs > 0 && r.totalMs <= FORTY_EIGHT_HOURS_MS;
    }).length;

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <div className="flex size-10 shrink-0 items-center">
            {student ? (
              <div className="bg-primary/10 flex items-center justify-center rounded-full size-10 overflow-hidden border border-primary/20">
                <span className="text-primary text-sm font-bold">
                  {getInitials(student.fullname)}
                </span>
              </div>
            ) : (
              <div className="bg-primary/10 flex items-center justify-center rounded-full size-10 overflow-hidden border border-primary/20">
                <Icon name="person" size={24} className="text-primary" />
              </div>
            )}
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 ml-3">
            My Dashboard
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative flex items-center justify-center rounded-lg h-10 w-10 hover:bg-primary/5 transition-colors"
              aria-label="Notifications"
              onClick={() => setShowNotifications(true)}
            >
              <Icon
                name="notifications"
                size={24}
                className="text-slate-600 dark:text-slate-400"
              />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex min-w-4 h-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full pb-24">
        {/* Hero */}
        <div className="p-4">
          <div className="flex gap-4 items-center">
            {student ? (
              <>
                <div className="bg-linear-to-br from-primary to-indigo-600 aspect-square rounded-2xl min-h-20 w-20 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <span className="text-3xl font-bold">
                    {getInitials(student.fullname)}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">
                    Hi, {student.fullname}!
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {student.department} • Year {student.level}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-linear-to-br from-primary to-indigo-600 aspect-square rounded-2xl min-h-20 w-20 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Icon name="person" size={32} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">
                    Hi, there!
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Your assignments
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 py-2">
          <ProgressSummary progress={progress} dueIn48h={dueIn48h} />
        </div>

        {/* Active Assignments */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">
              Active Assignments
            </h2>
            <button
              type="button"
              className="text-primary text-sm font-semibold flex items-center gap-1"
            >
              Sort by deadline
              <Icon name="swap_vert" size={18} />
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading assignments...</p>
          ) : error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : assignments.length === 0 ? (
            <p className="text-sm text-slate-500">
              No assignments have been posted yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  studentId={studentId}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <NotificationsModal
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        loading={notificationsLoading}
        error={notificationsError}
        onMarkAllRead={markAllAsRead}
      />

      <DashboardBottomNav />
    </>
  );
}
