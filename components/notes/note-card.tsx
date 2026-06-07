import Link from "next/link";
import { Archive, Clock, Pencil, Pin, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NoteCardProps = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  status?: "active" | "archived";
  updatedAt: string;
  pinned?: boolean;
  agent?: boolean;
  archiveAction?: (formData: FormData) => void | Promise<void>;
  deleteAction?: (formData: FormData) => void | Promise<void>;
};

export function NoteCard({
  id,
  title,
  excerpt,
  tags,
  status = "active",
  updatedAt,
  pinned,
  agent,
  archiveAction,
  deleteAction
}: NoteCardProps) {
  return (
    <article className="group min-h-[260px] rounded-2xl border border-border bg-white p-6 shadow-paper transition-colors hover:border-primary">
      <div className="mb-7 flex items-center justify-between">
        <span
          className={cn(
            "mono-label rounded-md px-2 py-1 text-[10px]",
            status === "active" ? "bg-blue-50 text-primary" : "bg-surface-dim text-ink-muted"
          )}
        >
          {agent ? "Agent" : status}
        </span>
        {pinned ? <Pin className="h-4 w-4 text-gold" /> : null}
      </div>
      <Link href={`/notes/${id}/edit`}>
        <h2 className="mb-4 font-display text-xl font-semibold leading-snug group-hover:text-primary">
          {title}
        </h2>
      </Link>
      <p className="mb-6 line-clamp-3 text-ink-muted">{excerpt}</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span key={tag} className="rounded-md bg-surface-dim px-2 py-1 font-mono text-xs">
              #{tag}
            </span>
          ))
        ) : (
          <span className="rounded-md bg-surface-dim px-2 py-1 font-mono text-xs text-ink-muted">
            untagged
          </span>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-2 font-mono text-sm text-ink-muted">
          <Clock className="h-4 w-4" />
          {updatedAt}
        </span>
        <div className="flex items-center gap-1">
          <Link
            href={`/notes/${id}/edit`}
            aria-label={`Edit ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-dim hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          {archiveAction ? (
            <form action={archiveAction}>
              <button
                type="submit"
                aria-label={`Archive ${title}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-dim hover:text-primary"
              >
                <Archive className="h-4 w-4" />
              </button>
            </form>
          ) : null}
          {deleteAction ? (
            <form action={deleteAction}>
              <button
                type="submit"
                aria-label={`Delete ${title}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-red-50 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </article>
  );
}
