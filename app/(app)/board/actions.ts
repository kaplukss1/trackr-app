"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatus(id: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  // Refresh halaman board agar data sinkron
  revalidatePath("/board");
  return { success: true };
}