import { Icon } from "@/components/common/Icon";
import type { AssignmentStatusValue } from "@/hooks/useAssignments";

interface StatusBadgeProps {
  status: AssignmentStatusValue;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isCompleted = status === "completed";

  const base =
    "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold";

  if (isCompleted) {
    return (
      <span className={`${base} bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400`}>
        <Icon name="check_circle" size={14} />
        DONE
      </span>
    );
  }

  return (
    <span className={`${base} bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400`}>
      <Icon name="priority_high" size={14} />
      PENDING
    </span>
  );
}
