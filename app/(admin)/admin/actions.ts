"use server";

import { createAssignmentNotificationsServer } from "@/services/notifications";
import {
  updateAssignmentServer,
  deleteAssignmentServer,
  type UpdateAssignmentPayload,
} from "@/services/admin";

export async function notifyAssignmentCreatedServer(args: {
  assignmentId: string;
  title: string;
}) {
  const { assignmentId, title } = args;
  await createAssignmentNotificationsServer(assignmentId, title);
}

export async function updateAssignmentAdminAction(
  id: string,
  payload: UpdateAssignmentPayload,
) {
  await updateAssignmentServer(id, payload);
}

export async function deleteAssignmentAdminAction(id: string) {
  await deleteAssignmentServer(id);
}
