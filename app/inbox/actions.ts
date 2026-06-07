"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getSupabaseForUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return supabase;
}

export async function archiveInboxItem(noteId: string) {
  const supabase = await getSupabaseForUser();
  const { error } = await supabase
    .from("notes")
    .update({
      status: "archived",
      updated_by: "user"
    })
    .eq("id", noteId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/inbox");
}

export async function deleteInboxItem(noteId: string) {
  const supabase = await getSupabaseForUser();
  const { error } = await supabase
    .from("notes")
    .update({
      status: "deleted",
      deleted_at: new Date().toISOString(),
      updated_by: "user"
    })
    .eq("id", noteId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/inbox");
}
