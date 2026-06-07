import { Plus, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { createClient } from "@/lib/supabase/server";
import { createTag, deleteTag } from "./actions";

type TagRow = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
};

async function getTags() {
  const supabase = await createClient();
  const [{ data: tags, error }, { data: noteTags }] = await Promise.all([
    supabase.from("tags").select("id,name,slug,color").order("name"),
    supabase.from("note_tags").select("tag_id")
  ]);

  if (error) {
    throw new Error(error.message);
  }

  const counts = new Map<string, number>();
  for (const row of noteTags ?? []) {
    counts.set(row.tag_id, (counts.get(row.tag_id) ?? 0) + 1);
  }

  return ((tags ?? []) as TagRow[]).map((tag) => ({
    ...tag,
    count: counts.get(tag.id) ?? 0
  }));
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <AppShell>
      <TopBar title="Tags" />
      <section className="mx-auto max-w-3xl px-5 py-7 lg:px-12">
        <div className="mb-5 flex h-14 items-center gap-4 rounded-2xl bg-surface-muted px-5 text-base text-ink-muted">
          <Search className="h-5 w-5" />
          Search tags...
        </div>

        <form action={createTag} className="mb-8 grid gap-3 rounded-2xl border border-border bg-white p-4 shadow-paper sm:grid-cols-[1fr_auto_auto]">
          <label>
            <span className="sr-only">Tag name</span>
            <input
              name="name"
              required
              className="h-12 w-full rounded-lg border border-border bg-white px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="New tag name"
            />
          </label>
          <label>
            <span className="sr-only">Tag color</span>
            <input
              name="color"
              type="color"
              defaultValue="#3b82f6"
              className="h-12 w-full rounded-lg border border-border bg-white p-2 sm:w-16"
            />
          </label>
          <button className="mono-label flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-white">
            <Plus className="h-4 w-4" />
            Add Tag
          </button>
        </form>

        {tags.length > 0 ? (
          <div className="space-y-4">
            {tags.map((tag) => (
              <article key={tag.id} className="flex items-center gap-5 rounded-2xl border border-border bg-white p-5 shadow-paper">
                <span
                  className="h-4 w-4 shrink-0 rounded-full shadow-lg"
                  style={{ backgroundColor: tag.color ?? "#3b82f6" }}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-medium">{tag.name}</h2>
                  <p className="font-mono text-sm text-ink-muted">
                    {tag.count} {tag.count === 1 ? "Note" : "Notes"}
                  </p>
                </div>
                <form action={deleteTag.bind(null, tag.id)}>
                  <button aria-label={`Delete ${tag.name}`} className="text-ink-muted hover:text-danger">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </form>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center shadow-paper">
            <h2 className="font-display text-2xl font-semibold">No tags yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted sm:text-base">
              Create tags here, then use them to organize notes and future agent scopes.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
