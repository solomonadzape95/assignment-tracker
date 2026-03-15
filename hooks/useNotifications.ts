"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/client";

export interface NotificationItem {
  id: string;
  title: string;
  created_at: string;
  read_at: string | null;
  assignment_id: string | null;
}

interface UseNotificationsResult {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAllAsRead: () => Promise<void>;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseBrowserClient) {
      setError("Supabase client is not configured.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!supabaseBrowserClient) {
          throw new Error("Supabase client is not configured.");
        }

        const { data, error: queryError } = await supabaseBrowserClient
          .from("notifications")
          .select("id, title, created_at, read_at, assignment_id")
          .order("created_at", { ascending: false })
          .limit(50);

        if (queryError) {
          // If the notifications table doesn't exist yet, fail gracefully.
          const code = (queryError as { code?: string }).code;
          if (code === "42P01") {
            if (!isMounted) return;
            setNotifications([]);
            setError(null);
            return;
          }
          throw queryError;
        }

        if (!isMounted) return;
        setNotifications((data ?? []) as NotificationItem[]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (!isMounted) return;
        setError("Failed to load notifications.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Initial load; we intentionally skip realtime to avoid client errors.
    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  async function markAllAsRead(): Promise<void> {
    try {
      await fetch("/notifications/mark-read", { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.read_at ? n : { ...n, read_at: new Date().toISOString() },
        ),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  return { notifications, unreadCount, loading, error, markAllAsRead };
}

