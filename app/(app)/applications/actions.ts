"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addApplication(data: {
  company_name: string;
  position: string;
  status: string;
  applied_date: string;
  job_url?: string;
  location?: string;
  salary?: string;
  notes?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("applications").insert({
    company_name: data.company_name,
    position: data.position,
    status: data.status,
    applied_date: data.applied_date,
    job_url: data.job_url || null,
    location: data.location || null,
    salary: data.salary || null,
    notes: data.notes || null,
  });

  if (error) {
    return { error: error.message };
  }

  // Ini akan memaksa Next.js mengambil ulang data terbaru dari database
  revalidatePath("/applications");
  return { success: true };
}