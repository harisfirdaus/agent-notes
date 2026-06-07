"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCapture(formData: FormData) {
  const contentValue = formData.get("content");
  const content = typeof contentValue === "string" ? contentValue.trim() : "";

  if (!content) {
    throw new Error("Capture content is required.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    type: "capture",
    title: null,
    content,
    content_format: "plain",
    status: "inbox",
    created_by: "user",
    updated_by: "user"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/capture");
  revalidatePath("/inbox");
  redirect("/inbox");
}

export async function updateCapture(captureId: string, formData: FormData) {
  const contentValue = formData.get("content");
  const content = typeof contentValue === "string" ? contentValue.trim() : "";

  if (!content) {
    throw new Error("Capture content is required.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("notes")
    .update({
      content,
      content_format: "plain",
      updated_by: "user"
    })
    .eq("id", captureId)
    .eq("type", "capture")
    .neq("status", "deleted");

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/inbox");
  revalidatePath(`/capture/${captureId}/edit`);
  redirect("/inbox");
}
