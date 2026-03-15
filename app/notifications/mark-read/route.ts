import { NextResponse } from "next/server";
import { getCurrentUserAndProfile } from "@/lib/auth";
import { markAllNotificationsReadServer } from "@/services/notifications";

export async function POST() {
  const auth = await getCurrentUserAndProfile({ redirectIfUnauthed: true });

  if (!auth) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  await markAllNotificationsReadServer(auth.user.id);

  return NextResponse.json({ success: true });
}

