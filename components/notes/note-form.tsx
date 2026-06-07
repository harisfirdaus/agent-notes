import Link from "next/link";
import { Save } from "lucide-react";

type NoteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: {
    title?: string | null;
    content?: string | null;
  };
};

export function NoteForm({ action, submitLabel, defaultValues }: NoteFormProps) {
  return (
    <form action={action} className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col px-5 py-7 lg:px-10">
      <label className="mb-5 block">
        <span className="sr-only">Title</span>
        <input
          name="title"
          defaultValue={defaultValues?.title ?? ""}
          required
          autoFocus
          className="h-16 w-full rounded-xl border border-border bg-white px-4 font-display text-3xl font-semibold outline-none placeholder:text-ink/30 focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Untitled note"
        />
      </label>

      <label className="flex min-h-[420px] flex-1 flex-col">
        <span className="mono-label mb-2 block text-ink-muted">Markdown</span>
        <textarea
          name="content"
          defaultValue={defaultValues?.content ?? ""}
          className="min-h-[420px] flex-1 resize-none rounded-xl border border-border bg-white p-5 font-mono text-base leading-7 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="# Start writing..."
        />
      </label>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/notes"
          className="mono-label flex h-12 items-center justify-center rounded-lg border border-border bg-white px-6 text-ink-muted"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="mono-label flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-white"
        >
          <Save className="h-4 w-4" />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
