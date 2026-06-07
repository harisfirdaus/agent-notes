import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { NoteForm } from "@/components/notes/note-form";
import { createClient } from "@/lib/supabase/server";
import { updateNote } from "../../actions";

type EditNotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from("notes")
    .select("id,title,content,type,status")
    .eq("id", id)
    .eq("type", "note")
    .neq("status", "deleted")
    .maybeSingle();

  if (error || !note) {
    notFound();
  }

  return (
    <AppShell>
      <TopBar title="Edit Note" />
      <NoteForm
        action={updateNote.bind(null, id)}
        submitLabel="Save Changes"
        defaultValues={{
          title: note.title,
          content: note.content
        }}
      />
    </AppShell>
  );
}
