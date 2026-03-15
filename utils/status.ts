export interface AssignmentProgress {
  total: number;
  completed: number;
  pending: number;
  percent: number;
}

export function getProgress(statuses: ("completed" | "pending")[]): AssignmentProgress {
  const total = statuses.length;
  const completed = statuses.filter((s) => s === "completed").length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    percent,
  };
}

