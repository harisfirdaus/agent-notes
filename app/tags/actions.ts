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

  return { supabase, userId: user.id };
}

export async function createTag(formData: FormData) {
  const nameValue = formData.get("name");
  const colorValue = formData.get("color");
  const name = typeof nameValue === "string" ? nameValue.trim() : "";
  const color = typeof colorValue === "string" && colorValue.trim() ? colorValue.trim() : "#3b82f6";

  if (!name) {
    throw new Error("Tag name is required.");
  }

  const { supabase, userId } = await getSupabaseForUser();
  const { error } = await supabase.from("tags").insert({
    user_id: userId,
    name,
    slug: "",
    color
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/tags");
}

export async function deleteTag(tagId: string) {
  const { supabase } = await getSupabaseForUser();
  const { error } = await supabase.from("tags").delete().eq("id", tagId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/tags");
}
