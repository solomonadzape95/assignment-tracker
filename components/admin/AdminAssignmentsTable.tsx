"use client";

import { useState } from "react";
import type { SimpleAssignment } from "@/services/admin";
import { formatDeadline } from "@/utils/dates";
import { Icon } from "@/components/common/Icon";
import { AdminAssignmentModal } from "@/components/admin/AdminAssignmentModal";
import { deleteAssignmentAdminAction } from "@/app/(admin)/admin/actions";

interface AdminAssignmentsTableProps {
  initialAssignments: SimpleAssignment[];
}

export function AdminAssignmentsTable({
  initialAssignments,
}: AdminAssignmentsTableProps) {
  const [assignments, setAssignments] =
    useState<SimpleAssignment[]>(initialAssignments);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [activeAssignment, setActiveAssignment] =
    useState<SimpleAssignment | null>(null);

  async function handleDelete(id: string) {
    if (!id) return;
    if (!window.confirm("Delete this assignment? This cannot be undone.")) {
      return;
    }
    setError(null);
    setLoadingId(id);
    try {
      await deleteAssignmentAdminAction(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Failed to delete assignment.");
    } finally {
      setLoadingId(null);
    }
  }

  function openModal(assignment: SimpleAssignment, mode: "view" | "edit") {
    setActiveAssignment(assignment);
    setModalMode(mode);
    setModalOpen(true);
  }

  function handleSaved(updated: SimpleAssignment) {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)),
    );
  }

  if (assignments.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No assignments have been created yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-sm">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-800/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Course
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Deadline
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-4 py-3 text-slate-100 font-medium">
                  {assignment.title}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {assignment.course_code}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {formatDeadline(assignment.deadline)}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {formatDeadline(assignment.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                      onClick={() => openModal(assignment, "view")}
                    >
                      <Icon name="visibility" size={16} />
                      View
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
                      onClick={() => openModal(assignment, "edit")}
                    >
                      <Icon name="edit" size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-950/30"
                      onClick={() => handleDelete(assignment.id)}
                      disabled={loadingId === assignment.id}
                    >
                      <Icon name="delete" size={16} />
                      {loadingId === assignment.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminAssignmentModal
        open={modalOpen}
        mode={modalMode}
        assignment={activeAssignment}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}

