"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { getProgress, type AssignmentProgress } from "@/utils/status";
import { getTimeRemaining } from "@/utils/dates";

export type AssignmentStatusValue = "pending" | "completed";

export interface AssignmentWithStatus {
  id: string;
  title: string;
  description: string;
  course_code: string;
  deadline: string;
  slug: string;
  status: AssignmentStatusValue;
  completed_at: string | null;
}

export interface UseAssignmentsResult {
  assignments: AssignmentWithStatus[];
  loading: boolean;
  error: string | null;
  progress: AssignmentProgress;
}

export function useAssignments(studentId: string): UseAssignmentsResult {
  const [assignments, setAssignments] = useState<AssignmentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!supabaseBrowserClient) {
        setError("Supabase client is not configured.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabaseBrowserClient
          .from("assignments")
          .select(
            "id, title, description, course_code, deadline, slug, assignment_status(status, completed_at, student_id)"
          )
          .order("deadline", { ascending: true });

        if (queryError) {
          throw queryError;
        }

        const enriched: AssignmentWithStatus[] =
          (data ?? []).map((row: any) => {
            const statusRow = (row.assignment_status || []).find(
              (s: any) => s.student_id === studentId
            );

            const status: AssignmentStatusValue = statusRow?.status ?? "pending";

            return {
              id: row.id,
              title: row.title,
              description: row.description,
              course_code: row.course_code,
              deadline: row.deadline,
              slug: row.slug,
              status,
              completed_at: statusRow?.completed_at ?? null,
            };
          }) ?? [];

        if (!isMounted) return;
        setAssignments(enriched);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError("Failed to load assignments.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    if (!supabaseBrowserClient) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabaseBrowserClient
      .channel("assignments-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignments" },
        () => {
          // Re-fetch on any assignment change.
          load();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabaseBrowserClient.removeChannel(channel);
    };
    // We intentionally omit `studentId` from dependencies for the realtime
    // subscription, as it is expected to be stable for the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = getProgress(assignments.map((a) => a.status));

  // Touch getTimeRemaining to ensure tree-shaking keeps it and to make it easy
  // for callers to derive per-assignment countdown info.
  assignments.forEach((assignment) => {
    getTimeRemaining(assignment.deadline);
  });

  return {
    assignments,
    loading,
    error,
    progress,
  };
}

