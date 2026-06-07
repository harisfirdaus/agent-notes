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

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readTags(formData: FormData) {
  const value = formData.get("tags");

  if (typeof value !== "string") {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
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

async function syncNoteTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  noteId: string,
  tagNames: string[]
) {
  await supabase.from("note_tags").delete().eq("note_id", noteId);

  if (tagNames.length === 0) {
    return;
  }

  const tags = tagNames
    .map((name) => ({
      user_id: userId,
      name,
      slug: slugify(name),
      color: "#3b82f6"
    }))
    .filter((tag) => tag.slug);

  if (tags.length === 0) {
    return;
  }

  const { data: upsertedTags, error: tagError } = await supabase
    .from("tags")
    .upsert(tags, { onConflict: "user_id,slug" })
    .select("id");

  if (tagError) {
    throw new Error(tagError.message);
  }

  const rows = (upsertedTags ?? []).map((tag) => ({
    note_id: noteId,
    tag_id: tag.id
  }));

  if (rows.length > 0) {
    const { error } = await supabase.from("note_tags").insert(rows);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function createNote(formData: FormData) {
  const title = readOptionalString(formData, "title") || "Untitled";
  const content = readOptionalString(formData, "content");
  const tags = readTags(formData);
  const { supabase, userId } = await getUserId();

  const { data: note, error } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
      type: "note",
      title,
      content,
      content_format: "markdown",
      status: "active",
      created_by: "user",
      updated_by: "user"
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await syncNoteTags(supabase, userId, note.id, tags);

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(noteId: string, formData: FormData) {
  const title = readOptionalString(formData, "title") || "Untitled";
  const content = readOptionalString(formData, "content");
  const tags = readTags(formData);
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("notes")
    .update({
      type: "note",
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

  await syncNoteTags(supabase, userId, noteId, tags);

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
