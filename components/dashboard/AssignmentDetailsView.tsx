"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Icon } from "@/components/common/Icon";
import { useCountdown } from "@/hooks/useCountdown";
import type { AssignmentDetail } from "@/services/assignments-client";
import { markAssignmentCompletedClient } from "@/services/assignments-client";
import { Button } from "@/components/common/Button";
import { useToast } from "@/hooks/useToast";
import { formatDeadline } from "@/utils/dates";

interface AssignmentDetailsViewProps {
  assignment: AssignmentDetail;
  studentId: string;
}

export function AssignmentDetailsView({
  assignment,
  studentId,
}: AssignmentDetailsViewProps) {
  const [status, setStatus] = useState(assignment.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const countdown = useCountdown(assignment.deadline);
  const isCompleted = status === "completed";

  const countdownLabel = countdown.isOverdue
    ? "Deadline passed"
    : `Time remaining: ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;

  async function handleMarkCompleted() {
    setError(null);
    if (isCompleted) return;

    setLoading(true);
    try {
      await markAssignmentCompletedClient(assignment.id, studentId);
      setStatus("completed");
      showToast("Assignment marked as completed.", "success");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to update assignment status.";
      setError(message);
      showToast("Failed to update assignment status.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 flex flex-col gap-6 bg-background-light dark:bg-background-dark min-h-screen">
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-primary/5"
        >
          <Icon name="arrow_back" size={24} />
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-slate-500 font-medium hover:text-primary"
          >
            Dashboard
          </Link>
          <Icon name="chevron_right" size={16} className="text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-semibold">
            Assignment Details
          </span>
        </nav>
      </div>

      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/10">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">
              {assignment.course_code}
            </span>
            <StatusBadge status={status} />
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            {assignment.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Due: {formatDeadline(assignment.deadline)}
          </p>
        </div>
      </div>

      {/* Deadline & countdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/10">
        <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">
          Time remaining
        </p>
        <p
          className={
            countdown.isOverdue
              ? "text-red-600 dark:text-red-400 font-bold"
              : countdown.isUrgent
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : "text-slate-900 dark:text-slate-100 font-bold"
          }
        >
          {countdownLabel}
        </p>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-primary/10">
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-4 flex items-center gap-2">
          <Icon name="description" size={22} className="text-primary" />
          Description
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
          {assignment.description}
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        fullWidth
        disabled={isCompleted || loading}
        onClick={handleMarkCompleted}
        className="bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
      >
        {isCompleted
          ? "Completed"
          : loading
            ? "Marking..."
            : "Mark as completed"}
      </Button>
    </div>
  );
}
