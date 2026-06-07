"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, MoreVertical, RefreshCw, Save } from "lucide-react";
import { cn } from "@/lib/utils";

type NoteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: {
    title?: string | null;
    content?: string | null;
    tags?: string[];
  };
  mode?: "new" | "edit";
  noteId?: string;
};

type SaveStatus = "saved" | "saving" | "unsaved" | "local" | "error";

const LOCAL_SAVE_DELAY_MS = 1000;
const REMOTE_AUTOSAVE_DELAY_MS = 7000;
const MIN_REMOTE_SAVE_INTERVAL_MS = 30000;

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

function makeSnapshot(title: string, content: string, tags: string) {
  return JSON.stringify({
    title: title.trim() || "Untitled",
    content,
    tags: parseTags(tags)
  });
}

function statusLabel(status: SaveStatus, hasRemoteAutosave: boolean) {
  if (!hasRemoteAutosave && status === "local") {
    return "Draft saved locally";
  }

  switch (status) {
    case "saving":
      return "Saving...";
    case "unsaved":
      return hasRemoteAutosave ? "Unsaved" : "Local draft";
    case "local":
      return hasRemoteAutosave ? "Unsaved" : "Draft saved locally";
    case "error":
      return "Autosave failed";
    case "saved":
    default:
      return hasRemoteAutosave ? "Saved" : "Manual save";
  }
}

function statusIcon(status: SaveStatus) {
  if (status === "saved" || status === "local") {
    return CheckCircle2;
  }

  if (status === "error") {
    return AlertCircle;
  }

  return RefreshCw;
}

export function NoteForm({
  action,
  submitLabel,
  defaultValues,
  mode = "new",
  noteId
}: NoteFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [tags, setTags] = useState(defaultValues?.tags?.join(", ") ?? "");
  const [status, setStatus] = useState<SaveStatus>(noteId ? "saved" : "local");
  const hasRemoteAutosave = Boolean(noteId);
  const draftKey = useMemo(
    () => `agentnotes:${noteId ? `note:${noteId}` : "new-note"}:draft`,
    [noteId]
  );
  const lastRemoteSaveAt = useRef(Date.now());
  const lastRemoteSnapshot = useRef(makeSnapshot(title, content, tags));
  const latestValues = useRef({ title, content, tags });
  const didInitializeLocalDraft = useRef(false);

  useEffect(() => {
    latestValues.current = { title, content, tags };
  }, [title, content, tags]);

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftKey);

    if (!savedDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(savedDraft) as {
        title?: string;
        content?: string;
        tags?: string;
        updatedAt?: number;
      };

      const currentSnapshot = makeSnapshot(title, content, tags);
      const draftSnapshot = makeSnapshot(parsed.title ?? "", parsed.content ?? "", parsed.tags ?? "");

      if (draftSnapshot !== currentSnapshot) {
        setTitle(parsed.title ?? "");
        setContent(parsed.content ?? "");
        setTags(parsed.tags ?? "");
        setStatus(hasRemoteAutosave ? "unsaved" : "local");
      }
    } catch {
      window.localStorage.removeItem(draftKey);
    }
    // Load once per note/editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  useEffect(() => {
    if (!didInitializeLocalDraft.current) {
      didInitializeLocalDraft.current = true;
      return;
    }

    setStatus((currentStatus) => (currentStatus === "saved" ? "unsaved" : currentStatus));

    const localTimer = window.setTimeout(() => {
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({
          title,
          content,
          tags,
          updatedAt: Date.now()
        })
      );

      if (!hasRemoteAutosave) {
        setStatus("local");
      }
    }, LOCAL_SAVE_DELAY_MS);

    return () => window.clearTimeout(localTimer);
  }, [content, draftKey, hasRemoteAutosave, tags, title]);

  useEffect(() => {
    if (!noteId) {
      return;
    }

    const currentSnapshot = makeSnapshot(title, content, tags);

    if (currentSnapshot === lastRemoteSnapshot.current) {
      return;
    }

    const elapsed = Date.now() - lastRemoteSaveAt.current;
    const waitMs =
      elapsed >= MIN_REMOTE_SAVE_INTERVAL_MS
        ? REMOTE_AUTOSAVE_DELAY_MS
        : REMOTE_AUTOSAVE_DELAY_MS + (MIN_REMOTE_SAVE_INTERVAL_MS - elapsed);

    const remoteTimer = window.setTimeout(async () => {
      const values = latestValues.current;
      const snapshotBeforeSave = makeSnapshot(values.title, values.content, values.tags);

      if (snapshotBeforeSave === lastRemoteSnapshot.current) {
        return;
      }

      setStatus("saving");

      try {
        const response = await fetch(`/api/notes/${noteId}/autosave`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: values.title,
            content: values.content,
            tags: parseTags(values.tags)
          })
        });

        if (!response.ok) {
          throw new Error("Autosave failed.");
        }

        lastRemoteSaveAt.current = Date.now();
        lastRemoteSnapshot.current = snapshotBeforeSave;
        window.localStorage.removeItem(draftKey);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, waitMs);

    return () => window.clearTimeout(remoteTimer);
  }, [content, draftKey, noteId, tags, title]);

  useEffect(() => {
    if (!noteId) {
      return;
    }

    async function flushAutosave() {
      const values = latestValues.current;
      const snapshot = makeSnapshot(values.title, values.content, values.tags);

      if (snapshot === lastRemoteSnapshot.current) {
        return;
      }

      try {
        await fetch(`/api/notes/${noteId}/autosave`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: values.title,
            content: values.content,
            tags: parseTags(values.tags)
          }),
          keepalive: true
        });
      } catch {
        // Local draft remains available if this final flush fails.
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        void flushAutosave();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flushAutosave);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flushAutosave);
    };
  }, [noteId]);

  const StatusIcon = statusIcon(status);

  return (
    <form action={action} className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex min-h-20 items-center gap-4 px-5 lg:px-8">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Note title</span>
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
              className="h-12 w-full border-0 bg-transparent p-0 font-mono text-xl text-ink outline-none placeholder:text-ink-muted focus:ring-0"
              placeholder="Untitled"
            />
          </label>
          <div
            className={cn(
              "ml-auto hidden items-center gap-2 rounded-full bg-surface-muted px-4 py-2 font-mono text-xs text-ink-muted md:flex",
              status === "error" && "bg-red-50 text-danger"
            )}
          >
            <StatusIcon className={cn("h-4 w-4", status === "saving" && "animate-spin")} />
            {statusLabel(status, hasRemoteAutosave)}
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
        <div className="px-5 pb-4 lg:px-8">
          <label className="block max-w-5xl">
            <span className="sr-only">Tags</span>
            <input
              name="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="h-9 w-full border-0 bg-transparent p-0 font-mono text-sm text-ink-muted outline-none placeholder:text-ink-muted/70 focus:ring-0"
              placeholder="Add tags separated by comma..."
            />
          </label>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 py-5 lg:px-8">
        <label className="flex flex-1 flex-col">
          <span className="sr-only">Markdown content</span>
          <textarea
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-[calc(100dvh-11rem)] flex-1 resize-none border-0 bg-transparent p-0 font-mono text-base leading-8 text-ink outline-none placeholder:text-ink-muted/60 focus:ring-0 lg:text-lg"
            placeholder={mode === "new" ? "# Start writing..." : "Continue writing..."}
          />
        </label>
      </main>
    </form>
  );
}
