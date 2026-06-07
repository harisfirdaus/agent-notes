import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AutosavePayload = {
  title?: string;
  content?: string;
  tags?: string[];
  tagsChanged?: boolean;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function syncNoteTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  noteId: string,
  tagNames: string[]
) {
  await supabase.from("note_tags").delete().eq("note_id", noteId);

  const tags = Array.from(new Set(tagNames.map((tag) => tag.trim()).filter(Boolean)))
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = (await request.json()) as AutosavePayload;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const title = payload.title?.trim() || "Untitled";
  const content = typeof payload.content === "string" ? payload.content : "";
  const shouldSyncTags = payload.tagsChanged === true;
  const tags = shouldSyncTags && Array.isArray(payload.tags) ? payload.tags : [];

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
    .eq("id", id)
    .eq("user_id", user.id)
    .neq("status", "deleted");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (shouldSyncTags) {
    try {
      await syncNoteTags(supabase, user.id, id, tags);
    } catch (syncError) {
      return NextResponse.json(
        { error: syncError instanceof Error ? syncError.message : "Failed to sync tags." },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ savedAt: new Date().toISOString() });
}
