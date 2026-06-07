import Link from "next/link";
import { Plus } from "lucide-react";
import { FilterChip } from "@/components/ui/filter-chip";
import { AppShell } from "@/components/layout/app-shell";
import { NoteCard } from "@/components/notes/note-card";
import { TopBar } from "@/components/layout/top-bar";
import { createClient } from "@/lib/supabase/server";
import { archiveNote, deleteNote } from "./actions";

type NoteRow = {
  id: string;
  title: string | null;
  content: string;
  status: "active" | "archived";
  updated_at: string;
  created_by: "user" | "agent";
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

  const [{ data: notes, error: notesError }, { data: spaces }, { data: tags }] = await Promise.all([
    supabase
      .from("notes")
      .select("id,title,content,status,updated_at,created_by")
      .eq("type", "note")
      .in("status", ["active", "archived"])
      .order("updated_at", { ascending: false }),
    supabase.from("spaces").select("id,name").order("name"),
    supabase.from("tags").select("id,name,slug").order("name").limit(10)
  ]);

  if (notesError) {
    throw new Error(notesError.message);
  }

  return {
    notes: (notes ?? []) as NoteRow[],
    spaces: spaces ?? [],
    tags: tags ?? []
  };
}

export default async function NotesPage() {
  const { notes, spaces, tags } = await getNotesData();

  return (
    <AppShell>
      <TopBar title="Notes" searchPlaceholder="Search across all notes..." />
      <div className="grid min-h-[calc(100dvh-5rem)] lg:grid-cols-[1fr_300px]">
        <section className="px-5 py-8 lg:px-12">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <FilterChip active>All Notes</FilterChip>
            <FilterChip>Active</FilterChip>
            <FilterChip>Archived</FilterChip>
            <Link
              href="/notes/new"
              className="mono-label ml-auto flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-white"
            >
              <Plus className="h-4 w-4" />
              New Note
            </Link>
          </div>

          {notes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  title={note.title ?? "Untitled note"}
                  excerpt={makeExcerpt(note.content)}
                  tags={[]}
                  status={note.status}
                  updatedAt={formatUpdatedAt(note.updated_at)}
                  agent={note.created_by === "agent"}
                  archiveAction={archiveNote.bind(null, note.id)}
                  deleteAction={deleteNote.bind(null, note.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center shadow-paper">
              <h2 className="font-display text-2xl font-semibold">No notes yet</h2>
              <p className="mx-auto mt-3 max-w-md text-ink-muted">
                Create your first Markdown note. Captures, tags, and spaces can be connected next.
              </p>
              <Link
                href="/notes/new"
                className="mono-label mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-white"
              >
                <Plus className="h-4 w-4" />
                New Note
              </Link>
            </div>
          )}
        </section>

        <aside className="hidden self-stretch border-l border-border px-7 py-8 lg:block">
          <section className="mb-12">
            <h2 className="mono-label mb-6 text-lg tracking-[0.25em]">Workspace Spaces</h2>
            <div className="space-y-5">
              {spaces.length > 0 ? (
                spaces.map((space) => (
                  <div key={space.id} className="flex items-center gap-3 text-sm">
                    <span className="h-4 w-4 rounded border border-border bg-white" />
                    <span>{space.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-muted">No spaces yet.</p>
              )}
            </div>
          </section>
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
