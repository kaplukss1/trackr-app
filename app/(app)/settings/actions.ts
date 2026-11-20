"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { full_name: string }) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: data.full_name }
  });

  if (error) return { error: error.message };
  revalidatePath("/settings");
  revalidatePath("/"); // Untuk update nama di sidebar
  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteAllApplications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Menghapus SEMUA aplikasi milik user ini
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  
  revalidatePath("/dashboard");
  revalidatePath("/board");
  revalidatePath("/applications");
  return { success: true };
}

export async function getApplicationsForExport() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("applications")
    .select("company_name, position, status, applied_date, location, salary, job_url")
    .eq("user_id", user.id)
    .order("applied_date", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}