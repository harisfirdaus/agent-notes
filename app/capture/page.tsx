import { Folder, Mic, Paperclip, Plus, Save, Tag } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export default function CapturePage() {
  return (
    <AppShell>
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-7 lg:min-h-0 lg:py-12">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="font-display text-2xl font-bold text-primary">AgentNotes</p>
        </div>
        <p className="mono-label mb-6 flex items-center gap-2 text-ink-muted">
          Captures go to Inbox and can be organized later.
        </p>
        <textarea
          className="min-h-[360px] w-full resize-none border border-primary bg-white p-5 font-display text-4xl font-bold text-ink outline-none placeholder:text-ink/30 focus:ring-2 focus:ring-primary lg:min-h-[420px]"
          placeholder="Write a quick capture..."
        />

        <div className="my-8 border-t border-border" />

        <label className="mb-4 block">
          <span className="mono-label mb-3 block text-ink-muted">Space</span>
          <span className="flex h-16 items-center gap-4 rounded-2xl border border-border bg-white px-5 text-xl">
            <Folder className="h-6 w-6 text-ink-muted" />
            Inbox (Default)
          </span>
        </label>

        <label className="mb-5 block">
          <span className="mono-label mb-3 block text-ink-muted">Tags</span>
          <span className="flex h-16 items-center gap-4 rounded-2xl border border-border bg-white px-5 text-xl text-ink-muted">
            <Tag className="h-6 w-6" />
            Add tags separated by comma...
          </span>
        </label>

        <div className="mb-8 flex flex-wrap gap-3">
          <button className="rounded-full border border-border bg-white px-4 py-2 font-mono text-sm">Recent: #work</button>
          <button className="rounded-full border border-border bg-white px-4 py-2 font-mono text-sm">Recent: #ideas</button>
          <button className="rounded-full border border-border bg-white px-4 py-2 font-mono text-sm">+ New Tag</button>
        </div>

        <div className="mt-auto border-t border-border pt-6">
          <div className="mb-6 flex justify-center gap-5 text-ink-muted">
            <Mic className="h-6 w-6" />
            <Paperclip className="h-6 w-6" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="mono-label h-16 rounded-lg border border-border bg-white text-ink-muted">
              Cancel
            </button>
            <button className="mono-label flex h-16 items-center justify-center gap-3 rounded-lg bg-primary text-white">
              <Save className="h-5 w-5" />
              Save Capture
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
