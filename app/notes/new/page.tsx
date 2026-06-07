import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { NoteForm } from "@/components/notes/note-form";
import { createNote } from "../actions";

export default function NewNotePage() {
  return (
    <AppShell>
      <TopBar title="New Note" />
      <NoteForm action={createNote} submitLabel="Save Note" />
    </AppShell>
  );
}
