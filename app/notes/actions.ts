"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getUserId() {
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

export async function createNote(formData: FormData) {
  const title = readRequiredString(formData, "title");
  const content = readOptionalString(formData, "content");
  const { supabase, userId } = await getUserId();

  const { error } = await supabase.from("notes").insert({
    user_id: userId,
    type: "note",
    title,
    content,
    content_format: "markdown",
    status: "active",
    created_by: "user",
    updated_by: "user"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(noteId: string, formData: FormData) {
  const title = readRequiredString(formData, "title");
  const content = readOptionalString(formData, "content");
  const { supabase } = await getUserId();

  const { error } = await supabase
    .from("notes")
    .update({
      title,
      content,
      content_format: "markdown",
      status: "active",
      updated_by: "user"
    })
    .eq("id", noteId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}/edit`);
  redirect("/notes");
}

export async function archiveNote(noteId: string) {
  const { supabase } = await getUserId();

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

  revalidatePath("/notes");
}

export async function deleteNote(noteId: string) {
  const { supabase } = await getUserId();

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

  revalidatePath("/notes");
}
