"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import type { SimpleAssignment } from "@/services/admin";
import { notifyAssignmentCreatedServer } from "@/app/(admin)/admin/actions";
import { useToast } from "@/hooks/useToast";

interface AssignmentFormProps {
  onCreated?: (assignment: SimpleAssignment) => void;
}

export function AssignmentForm({ onCreated }: AssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (!supabaseBrowserClient) {
      setError("Supabase is not configured.");
      return;
    }

    if (!title || !courseCode || !description || !deadline) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const slug =
        `${courseCode}-${title}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      const { data, error: insertError } = await supabaseBrowserClient
        .from("assignments")
        .insert({
          title,
          course_code: courseCode,
          description,
          deadline: new Date(deadline).toISOString(),
          slug,
        })
        .select("id, title, course_code, description, deadline, created_at, slug")
        .maybeSingle();

      if (insertError) {
        throw insertError;
      }

      if (data && onCreated) {
        onCreated(data as SimpleAssignment);
      }

      if (data) {
        try {
          await notifyAssignmentCreatedServer({
            assignmentId: data.id as string,
            title: data.title as string,
          });
          setInfo("Assignment created and notifications added.");
          showToast("Assignment created and notifications added.", "success");
        } catch (notifyError) {
          // eslint-disable-next-line no-console
          console.error(notifyError);
          setInfo("Assignment created, but notifications could not be added.");
          showToast(
            "Assignment created, but notifications could not be added.",
            "error"
          );
        }
      }

      setTitle("");
      setCourseCode("");
      setDescription("");
      setDeadline("");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to create assignment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="course_code"
            className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            Course Code
          </label>
          <input
            id="course_code"
            type="text"
            value={courseCode}
            onChange={(event) => setCourseCode(event.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="deadline"
          className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
        >
          Deadline
        </label>
        <input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-[100px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {info ? (
        <p className="text-sm text-emerald-700" role="status">
          {info}
        </p>
      ) : null}

      <Button
        type="submit"
        fullWidth
        disabled={loading}
        className="bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
      >
        <Icon name="add" size={20} />
        {loading ? "Creating..." : "Create assignment"}
      </Button>
    </form>
  );
}

