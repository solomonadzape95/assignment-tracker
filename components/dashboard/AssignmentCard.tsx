import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Icon } from "@/components/common/Icon";
import type { AssignmentWithStatus } from "@/hooks/useAssignments";
import { formatDeadline, getDueLabel, getTimeRemaining } from "@/utils/dates";
import { markAssignmentCompletedClient } from "@/services/assignments-client";
import { useToast } from "@/hooks/useToast";

interface AssignmentCardProps {
  assignment: AssignmentWithStatus;
  studentId: string;
}

export function AssignmentCard({ assignment, studentId }: AssignmentCardProps) {
  const { showToast } = useToast();
  const [status, setStatus] = useState(assignment.status);
  const [marking, setMarking] = useState(false);

  const remaining = getTimeRemaining(assignment.deadline);
  const dueLabel = getDueLabel(assignment.deadline);
  const formattedDate = formatDeadline(assignment.deadline);
  const isCompleted = status === "completed";
  const isUrgent = remaining.isUrgent && !remaining.isOverdue;

  const countdownColor = remaining.isOverdue
    ? "text-red-600 dark:text-red-400"
    : isUrgent
      ? "text-red-600 dark:text-red-400 font-medium"
      : "text-slate-500 dark:text-slate-400";

  const cardBase =
    "group relative rounded-2xl p-4 shadow-sm border flex flex-col gap-3";
  const cardStyle = isCompleted
    ? "bg-slate-50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 opacity-80"
    : isUrgent
      ? "bg-white dark:bg-slate-900/50 border-2 border-red-500/30 border-slate-100 dark:border-slate-800"
      : "bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800";

  async function handleMarkCompleted() {
    if (isCompleted || marking) return;

    try {
      setMarking(true);
      await markAssignmentCompletedClient(assignment.id, studentId);
      setStatus("completed");
      showToast("Assignment marked as completed.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to mark assignment as completed.", "error");
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className={`${cardBase} ${cardStyle}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
            {assignment.course_code}
          </span>
          <h3
            className={
              isCompleted
                ? "text-slate-500 dark:text-slate-400 text-base font-bold leading-tight line-through"
                : "text-slate-900 dark:text-slate-100 text-base font-bold leading-tight"
            }
          >
            {assignment.title}
          </h3>
        </div>
        <StatusBadge status={assignment.status} />
      </div>

      <div className="flex items-center gap-4 py-1">
        <div
          className={`flex items-center gap-1.5 text-xs ${countdownColor}`}
        >
          <Icon name="schedule" size={16} />
          {dueLabel}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
          <Icon name="calendar_today" size={16} />
          {formattedDate}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Link
          href={`/assignments/${assignment.slug}`}
          className={
            isCompleted
              ? "flex-1 bg-primary/10 text-primary text-sm font-bold py-2.5 rounded-xl hover:bg-primary/20 transition-all text-center"
              : isUrgent
                ? "flex-1 bg-primary text-white text-sm font-bold py-2.5 rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all text-center"
                : "flex-1 bg-primary/10 text-primary text-sm font-bold py-2.5 rounded-xl hover:bg-primary/20 transition-all text-center"
          }
        >
          View Details
        </Link>
        {isCompleted ? (
          <span className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Completed
          </span>
        ) : (
          <button
            type="button"
            onClick={handleMarkCompleted}
            disabled={marking}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-emerald-500/20 transition-colors"
          >
            {marking ? "Marking..." : "Mark done"}
          </button>
        )}
      </div>
    </div>
  );
}
