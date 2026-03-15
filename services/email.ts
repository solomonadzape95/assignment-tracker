"use client";

import { supabaseBrowserClient } from "@/lib/supabase/client";

export async function triggerAssignmentNotificationsClient(
  assignmentId: string
): Promise<void> {
  if (!supabaseBrowserClient) {
    throw new Error("Supabase client is not configured.");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabaseBrowserClient.auth.getSession();

  if (sessionError || !session) {
    throw new Error("Unable to load current session for notifications.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  const url = new URL(supabaseUrl);
  const projectRef = url.hostname.split(".")[0];
  const functionUrl = `https://${projectRef}.functions.supabase.co/send-assignment-notifications`;

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ assignmentId }),
  });

  if (!response.ok) {
    throw new Error("Failed to trigger assignment notifications.");
  }
}

