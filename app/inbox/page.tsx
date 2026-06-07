import Link from "next/link";
import { Archive, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { FilterChip } from "@/components/ui/filter-chip";
import { createClient } from "@/lib/supabase/server";
import { archiveInboxItem, deleteInboxItem } from "./actions";

type InboxRow = {
  id: string;
  title: string | null;
  content: string;
  type: "capture" | "note";
  created_by: "user" | "agent";
  updated_at: string;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function titleFor(item: InboxRow) {
  if (item.title?.trim()) {
    return item.title;
  }

  return item.type === "capture" ? "Quick Capture" : "Untitled Note";
}

function excerptFor(content: string) {
  return content.replace(/\s+/g, " ").trim() || "No content yet.";
}

async function getInboxItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id,title,content,type,created_by,updated_at")
    .eq("status", "inbox")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as InboxRow[];
}

export default async function InboxPage() {
  const items = await getInboxItems();

  return (
    <AppShell>
      <TopBar title="Inbox" searchPlaceholder="Search inbox..." />
      <section className="mx-auto max-w-3xl px-4 py-5 sm:px-5 lg:max-w-none lg:px-12">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-2">
          <FilterChip active>All</FilterChip>
          <FilterChip>Capture</FilterChip>
          <FilterChip>Notes</FilterChip>
          <FilterChip>Agent</FilterChip>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border bg-white p-4 shadow-paper sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="mono-label rounded-md bg-blue-50 px-2 py-1 text-[10px] text-primary">
                    {item.type}
                  </span>
                  <span className="mono-label rounded-md bg-surface-dim px-2 py-1 text-[10px] text-ink-muted">
                    {item.created_by}
                  </span>
                </div>
                <h2 className="mb-2 font-display text-xl font-semibold leading-snug">
                  {titleFor(item)}
                </h2>
                <p className="mb-5 line-clamp-4 text-sm leading-6 text-ink-muted sm:text-base">
                  {excerptFor(item.content)}
                </p>
                <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="font-mono text-xs text-ink-muted">{formatTime(item.updated_at)}</span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.type === "capture" ? `/capture/${item.id}/edit` : `/notes/${item.id}/edit`}
                      aria-label="Edit item"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-dim hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={archiveInboxItem.bind(null, item.id)}>
                      <button
                        type="submit"
                        aria-label="Archive item"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-dim hover:text-primary"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={deleteInboxItem.bind(null, item.id)}>
                      <button
                        type="submit"
                        aria-label="Delete item"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center shadow-paper">
            <h2 className="font-display text-2xl font-semibold">Inbox is clear</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted sm:text-base">
              Captures you save will appear here before they are organized into notes.
            </p>
            <Link
              href="/capture"
              className="mono-label mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-white"
            >
              <Plus className="h-4 w-4" />
              New Capture
            </Link>
          </div>
        )}
      </section>
    </AppShell>
  );
}
