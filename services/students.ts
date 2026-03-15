import { supabaseBrowserClient } from "@/lib/supabase/client";

export interface Student {
  id: string;
  reg_no: string;
  fullname: string;
  department: string;
  level: string;
}

export async function getStudentByRegNoClient(
  regNo: string
): Promise<Student | null> {
  if (!supabaseBrowserClient) {
    throw new Error("Supabase client is not configured in the browser.");
  }

  const { data, error } = await supabaseBrowserClient
    .from("students")
    .select("id, reg_no, fullname, department, level")
    .eq("reg_no", regNo)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Student | null;
}
