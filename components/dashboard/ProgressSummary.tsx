import { Icon } from "@/components/common/Icon";
import type { AssignmentProgress } from "@/utils/status";

interface ProgressSummaryProps {
  progress: AssignmentProgress;
  /** Number of assignments due within the next 48 hours (optional info line) */
  dueIn48h?: number;
}

export function ProgressSummary({ progress, dueIn48h }: ProgressSummaryProps) {
  const { total, completed, percent } = progress;
  const width = `${percent}%`;

  return (
    <section className="bg-white dark:bg-slate-900/50 rounded-2xl p-5 shadow-sm border border-primary/5">
      <div className="flex gap-6 justify-between items-end mb-3">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            Weekly Progress
          </p>
          <p className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-none mt-1">
            {completed}/{total} Assignments
          </p>
        </div>
        <p className="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-lg">
          {percent}%
        </p>
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width }}
        />
      </div>
      {dueIn48h !== undefined && dueIn48h > 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 flex items-center gap-1">
          <Icon name="info" size={14} />
          You have {dueIn48h} assignment{dueIn48h === 1 ? "" : "s"} due within
          the next 48 hours.
        </p>
      )}
    </section>
  );
}
