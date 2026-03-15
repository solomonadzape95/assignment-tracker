"use client";

import { useEffect, useState } from "react";
import type { SimpleAssignment } from "@/services/admin";
import { formatDeadline } from "@/utils/dates";
import { Icon } from "@/components/common/Icon";
import { updateAssignmentAdminAction } from "@/app/(admin)/admin/actions";

interface AdminAssignmentModalProps {
  open: boolean;
  mode: "view" | "edit";
  assignment: SimpleAssignment | null;
  onClose: () => void;
  onSaved: (assignment: SimpleAssignment) => void;
}

export function AdminAssignmentModal({
  open,
  mode,
  assignment,
  onClose,
  onSaved,
}: AdminAssignmentModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (open && assignment && mode === "edit") {
      setTitle(assignment.title);
      setCourseCode(assignment.course_code);
      setDescription(assignment.description);
      setDeadline(new Date(assignment.deadline).toISOString().slice(0, 16));
      setError(null);
      setSaving(false);
    }
  }, [open, assignment, mode]);

  if (!open || !assignment) return null;

  async function handleSave() {
    if (mode !== "edit" || !assignment) return;
    setSaving(true);
    setError(null);

    const payload = {
      title,
      course_code: courseCode,
      description,
      deadline: new Date(deadline).toISOString(),
    };

    try {
      await updateAssignmentAdminAction(assignment.id, payload);
      onSaved({
        ...assignment,
        title,
        course_code: courseCode,
        description,
        deadline: payload.deadline ?? assignment.deadline,
      });
      onClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Failed to update assignment.");
    } finally {
      setSaving(false);
    }
  }

  const isEdit = mode === "edit";

  const originalDeadline =
    assignment && assignment.deadline
      ? new Date(assignment.deadline).toISOString().slice(0, 16)
      : "";

  const hasChanges =
    title !== assignment.title ||
    courseCode !== assignment.course_code ||
    description !== assignment.description ||
    deadline !== originalDeadline;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Icon name="assignment" size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                {isEdit ? "Edit assignment" : "Assignment details"}
              </h2>
              <p className="text-xs text-slate-400">
                {assignment.course_code} •{" "}
                {formatDeadline(assignment.deadline)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
            aria-label="Close"
          >
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {error ? (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          ) : null}

          <div className="space-y-1 text-sm">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Title
            </label>
            {isEdit ? (
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <p className="text-slate-100 font-medium">{assignment.title}</p>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Course code
            </label>
            {isEdit ? (
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            ) : (
              <p className="text-slate-100">{assignment.course_code}</p>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Deadline
            </label>
            {isEdit ? (
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            ) : (
              <p className="text-slate-100">
                {formatDeadline(assignment.deadline)}
              </p>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Description
            </label>
            {isEdit ? (
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <p className="text-slate-200 whitespace-pre-line">
                {assignment.description}
              </p>
            )}
          </div>

          <p className="text-[11px] text-slate-500">
            Created {formatDeadline(assignment.created_at)}.
          </p>
        </div>

        <footer className="flex items-center justify-between gap-3 px-5 py-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
          {isEdit ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={
                saving ||
                !hasChanges ||
                !title.trim() ||
                !courseCode.trim() ||
                !deadline
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              <Icon name="save" size={16} />
              {saving
                ? "Saving..."
                : hasChanges
                  ? "Save changes"
                  : "No changes"}
            </button>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

