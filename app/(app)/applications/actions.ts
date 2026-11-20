"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addApplication(data: any) {
  const supabase = await createClient();

  // Ambil data user yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("applications").insert({
    ...data,
    user_id: user.id, // <-- Tambahkan ini
  });

  if (error) return { error: error.message };
  revalidatePath("/applications");
  revalidatePath("/dashboard");
  revalidatePath("/board");
  return { success: true };
}

export async function updateApplication(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("applications")
    .update({
      company_name: data.company_name,
      position: data.position,
      status: data.status,
      applied_date: data.applied_date,
      interview_date: data.interview_date ? new Date(data.interview_date).toISOString() : null, // <-- Tambahkan ini
      job_url: data.job_url || null,
      location: data.location || null,
      salary: data.salary || null,
      notes: data.notes || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  revalidatePath("/dashboard"); // Agar dashboard ikut update
  return { success: true };
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // <-- Pastikan hanya bisa hapus miliknya sendiri

  if (error) return { error: error.message };
  revalidatePath("/applications");
  revalidatePath("/dashboard");
  revalidatePath("/board");
  return { success: true };
}

export async function addTimelineEvent(
  applicationId: string,
  data: { title: string; description: string; event_date: string }
) {
  const supabase = await createClient();

  const { error } = await supabase.from("application_events").insert({
    application_id: applicationId,
    title: data.title,
    description: data.description,
    event_date: new Date(data.event_date).toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath(`/applications/${applicationId}`);
  return { success: true };
}