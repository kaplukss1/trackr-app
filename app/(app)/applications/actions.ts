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
    .update({ ...data })
    .eq("id", id)
    .eq("user_id", user.id); // <-- Pastikan hanya bisa edit miliknya sendiri

  if (error) return { error: error.message };
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/board");
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