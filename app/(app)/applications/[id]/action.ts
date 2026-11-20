"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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