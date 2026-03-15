export interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  isOverdue: boolean;
  isUrgent: boolean;
}

export function getTimeRemaining(deadline: string | Date): TimeRemaining {
  const target =
    typeof deadline === "string" ? new Date(deadline) : new Date(deadline);
  const now = new Date();
  const totalMs = target.getTime() - now.getTime();

  const clampedMs = Math.max(totalMs, 0);
  const days = Math.floor(clampedMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (clampedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((clampedMs % (1000 * 60 * 60)) / (1000 * 60));

  const isOverdue = totalMs < 0;
  const isUrgent = !isOverdue && totalMs <= 1000 * 60 * 60 * 24;

  return {
    totalMs,
    days,
    hours,
    minutes,
    isOverdue,
    isUrgent,
  };
}

/** Format deadline for display e.g. "Oct 24, 11:59 PM" */
export function formatDeadline(deadline: string | Date): string {
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** "Due in X hours" or "Due in X days" for display */
export function getDueLabel(deadline: string | Date): string {
  const r = getTimeRemaining(deadline);
  if (r.isOverdue) return "Deadline passed";
  if (r.days > 0) return `Due in ${r.days} day${r.days === 1 ? "" : "s"}`;
  if (r.hours > 0) return `Due in ${r.hours} hour${r.hours === 1 ? "" : "s"}`;
  if (r.minutes > 0) return `Due in ${r.minutes} min`;
  return "Due soon";
}

