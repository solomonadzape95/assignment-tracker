import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Student } from "@/services/students";

export async function getStudentByIdServer(id: string): Promise<Student | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("students")
    .select("id, reg_no, fullname, department, level")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Student | null;
}

