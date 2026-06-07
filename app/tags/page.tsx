import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";

const tags = [
  { name: "research-projects", count: 12, color: "bg-blue-500" },
  { name: "priority-high", count: 4, color: "bg-orange-500" },
  { name: "reading-list", count: 28, color: "bg-emerald-500" },
  { name: "personal-archive", count: 154, color: "bg-purple-500" }
];

export default function TagsPage() {
  return (
    <AppShell>
      <TopBar title="Tags" />
      <section className="mx-auto max-w-3xl px-5 py-7 lg:px-12">
        <div className="mb-7 flex h-16 items-center gap-4 rounded-2xl bg-surface-muted px-5 text-xl text-ink-muted">
          <Search className="h-6 w-6" />
          Search tags...
        </div>
        <button className="mono-label mb-8 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-lg text-white">
          <Plus className="h-6 w-6" />
          Add Tag
        </button>
        <div className="space-y-4">
          {tags.map((tag) => (
            <article key={tag.name} className="flex items-center gap-5 rounded-2xl border border-border bg-white p-6 shadow-paper">
              <span className={`h-4 w-4 rounded-full ${tag.color} shadow-lg`} />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-2xl">{tag.name}</h2>
                <p className="font-mono text-2xl text-ink-muted">{tag.count} Notes</p>
              </div>
              <button aria-label={`Edit ${tag.name}`} className="text-ink-muted hover:text-primary">
                <Edit3 className="h-6 w-6" />
              </button>
              <button aria-label={`Delete ${tag.name}`} className="text-ink-muted hover:text-danger">
                <Trash2 className="h-6 w-6" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
