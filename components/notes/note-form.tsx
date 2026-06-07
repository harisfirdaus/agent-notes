import Link from "next/link";
import { MoreVertical, RefreshCw, Save } from "lucide-react";

type NoteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: {
    title?: string | null;
    content?: string | null;
    tags?: string[];
  };
  mode?: "new" | "edit";
};

export function NoteForm({ action, submitLabel, defaultValues, mode = "new" }: NoteFormProps) {
  return (
    <form action={action} className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-20 items-center gap-4 px-5 lg:px-8">
          <Link href="/notes" className="font-display text-lg font-bold text-primary">
            AgentNotes
          </Link>
          <span className="hidden h-8 w-px bg-border sm:block" />
          <span className="hidden font-mono text-base text-ink-muted sm:inline">
            Precision Workspace /
          </span>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Note title</span>
            <input
              name="title"
              defaultValue={defaultValues?.title ?? ""}
              autoFocus
              className="h-12 w-full border-0 bg-transparent p-0 font-mono text-base text-ink outline-none placeholder:text-ink-muted focus:ring-0"
              placeholder="Untitled"
            />
          </label>
          <div className="ml-auto hidden items-center gap-2 rounded-full bg-surface-muted px-4 py-2 font-mono text-xs text-ink-muted md:flex">
            <RefreshCw className="h-4 w-4" />
            Synchronized
          </div>
          <button
            type="submit"
            className="mono-label flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-white"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">{submitLabel}</span>
            <span className="sm:hidden">Save</span>
          </button>
          <Link
            href="/notes"
            className="mono-label hidden h-10 items-center justify-center rounded-lg border border-border bg-white px-4 text-ink-muted sm:flex"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-dim"
            aria-label="More actions"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 py-5 lg:px-8">
        <div className="mb-4 max-w-5xl">
          <label className="block">
            <span className="sr-only">Tags</span>
            <input
              name="tags"
              defaultValue={defaultValues?.tags?.join(", ") ?? ""}
              className="h-10 w-full border-0 bg-transparent p-0 font-mono text-sm text-ink-muted outline-none placeholder:text-ink-muted/70 focus:ring-0"
              placeholder="Add tags separated by comma..."
            />
          </label>
        </div>

        <label className="flex flex-1 flex-col">
          <span className="sr-only">Markdown content</span>
          <textarea
            name="content"
            defaultValue={defaultValues?.content ?? ""}
            className="min-h-[calc(100dvh-11rem)] flex-1 resize-none border-0 bg-transparent p-0 font-mono text-base leading-8 text-ink outline-none placeholder:text-ink-muted/60 focus:ring-0 lg:text-lg"
            placeholder={
              mode === "new"
                ? "# Start writing..."
                : "Continue writing..."
            }
          />
        </label>
      </main>
    </form>
  );
}
