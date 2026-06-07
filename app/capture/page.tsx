import Link from "next/link";
import { Folder, Save } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { createCapture } from "./actions";

export default function CapturePage() {
  return (
    <AppShell>
      <TopBar title="Capture" />
      <section className="mx-auto max-w-3xl px-5 py-7 lg:px-10">
        <form action={createCapture} className="rounded-2xl border border-border bg-white p-5 shadow-paper sm:p-6">
          <p className="mono-label mb-4 text-ink-muted">Quick Capture</p>
          <textarea
            name="content"
            required
            autoFocus
            className="min-h-[180px] w-full resize-y rounded-xl border border-border bg-white p-4 text-base leading-7 text-ink outline-none placeholder:text-ink/35 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:min-h-[220px]"
            placeholder="Write a quick capture..."
          />

          <div className="mt-5 rounded-xl border border-border bg-surface-muted p-4">
            <div className="flex items-center gap-3 text-sm text-ink-muted">
              <Folder className="h-5 w-5" />
              <span>Inbox (Default)</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/inbox"
              className="mono-label flex h-12 items-center justify-center rounded-lg border border-border bg-white px-6 text-ink-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="mono-label flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-white"
            >
              <Save className="h-4 w-4" />
              Save Capture
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
