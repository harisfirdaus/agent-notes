import { AppShell } from "@/components/layout/app-shell";
import { NoteForm } from "@/components/notes/note-form";
import { createNote } from "../actions";

export default function NewNotePage() {
  return (
    <AppShell collapsibleSidebar>
      <NoteForm action={createNote} submitLabel="Save Note" mode="new" />
    </AppShell>
  );
}
