// Supabase Edge Function: send-assignment-notifications
// Sends email notifications to all registered students when a new assignment
// is created.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const emailApiKey = Deno.env.get("EMAIL_API_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !emailApiKey) {
      return new Response("Missing environment configuration", {
        status: 500,
      });
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? "",
        },
      },
    });

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const isAdmin = (user.app_metadata?.role ?? "") === "admin";
    if (!isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const { assignmentId } = await req.json();

    if (!assignmentId) {
      return new Response("assignmentId is required", { status: 400 });
    }

    const {
      data: assignment,
      error: assignmentError,
    } = await supabaseClient
      .from("assignments")
      .select("id, title, course_code, deadline")
      .eq("id", assignmentId)
      .maybeSingle();

    if (assignmentError || !assignment) {
      return new Response("Assignment not found", { status: 404 });
    }

    const {
      data: profiles,
      error: profilesError,
    } = await supabaseClient
      .from("profiles")
      .select("email")
      .not("email", "is", null);

    if (profilesError) {
      return new Response("Failed to load recipients", { status: 500 });
    }

    const recipients = (profiles ?? [])
      .map((p: any) => p.email as string)
      .filter(Boolean);

    if (recipients.length === 0) {
      return new Response("No recipients to notify", { status: 200 });
    }

    const subject = "New Assignment Posted";
    const deadlineText = new Date(assignment.deadline).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const bodyText = [
      "A new assignment has been added.",
      "",
      `Course: ${assignment.course_code}`,
      `Title: ${assignment.title}`,
      `Deadline: ${deadlineText}`,
      "",
      "Please login to view details.",
    ].join("\n");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "no-reply@your-domain.com",
        to: recipients,
        subject,
        text: bodyText,
      }),
    });

    if (!emailResponse.ok) {
      const text = await emailResponse.text();
      console.error("Email provider error", text);
      return new Response("Failed to send emails", { status: 502 });
    }

    return new Response(
      JSON.stringify({
        success: true,
        notified: recipients.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Function error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

