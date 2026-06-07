import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { NoteCard } from "@/components/notes/note-card";
import { TopBar } from "@/components/layout/top-bar";
import { createClient } from "@/lib/supabase/server";
import { deleteNote } from "./actions";

type NoteRow = {
  id: string;
  title: string | null;
  content: string;
  status: "inbox" | "active" | "archived";
  updated_at: string;
  created_by: "user" | "agent";
  tags: string[];
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function makeExcerpt(content: string) {
  const clean = content
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return clean || "No content yet.";
}

async function getNotesData() {
  const supabase = await createClient();

  const [{ data: notes, error: notesError }, { data: tags }, { data: noteTags }] = await Promise.all([
    supabase
      .from("notes")
      .select("id,title,content,status,updated_at,created_by")
      .in("status", ["active", "inbox"])
      .order("updated_at", { ascending: false }),
    supabase.from("tags").select("id,name,slug").order("name").limit(10),
    supabase.from("note_tags").select("note_id,tags(name,slug)")
  ]);

  if (notesError) {
    throw new Error(notesError.message);
  }

  const tagsByNote = new Map<string, string[]>();

  for (const row of noteTags ?? []) {
    const tag = Array.isArray(row.tags) ? row.tags[0] : row.tags;

    if (!tag) {
      continue;
    }

    const value = tag.slug || tag.name;
    const currentTags = tagsByNote.get(row.note_id) ?? [];
    currentTags.push(value);
    tagsByNote.set(row.note_id, currentTags);
  }

  return {
    notes: ((notes ?? []) as Omit<NoteRow, "tags">[]).map((note) => ({
      ...note,
      tags: tagsByNote.get(note.id) ?? []
    })),
    tags: tags ?? []
  };
}

export default async function NotesPage() {
  const { notes, tags } = await getNotesData();

  return (
    <AppShell>
      <TopBar title="Notes" searchPlaceholder="Search across all notes..." />
      <div className="grid min-h-dvh lg:grid-cols-[1fr_300px]">
        <section className="px-5 py-8 lg:px-12">
          {notes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  title={note.title ?? "Untitled"}
                  excerpt={makeExcerpt(note.content)}
                  tags={note.tags}
                  status={note.status}
                  updatedAt={formatUpdatedAt(note.updated_at)}
                  agent={note.created_by === "agent"}
                  deleteAction={deleteNote.bind(null, note.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center shadow-paper">
              <h2 className="font-display text-2xl font-semibold">No notes yet</h2>
              <p className="mx-auto mt-3 max-w-md text-ink-muted">
                Create your first note from the sidebar or the mobile plus button.
              </p>
            </div>
          )}
        </section>

        <aside className="hidden min-h-dvh self-stretch border-l border-border px-7 py-8 lg:block">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="mono-label text-lg tracking-[0.25em]">Top Tags</h2>
              <Link href="/tags" className="mono-label text-[10px] text-primary">
                Manage
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span key={tag.id} className="rounded-md bg-surface-dim px-3 py-2 font-mono text-xs">
                    #{tag.slug || tag.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-ink-muted">No tags yet.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
