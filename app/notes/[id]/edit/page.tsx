import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
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
    .neq("status", "deleted")
    .maybeSingle();

  if (error || !note) {
    notFound();
  }

  const { data: noteTags } = await supabase
    .from("note_tags")
    .select("tags(name)")
    .eq("note_id", id);

  const tags =
    noteTags
      ?.map((row) => {
        const tag = Array.isArray(row.tags) ? row.tags[0] : row.tags;
        return tag?.name;
      })
      .filter((name): name is string => Boolean(name)) ?? [];

  return (
    <AppShell collapsibleSidebar>
      <NoteForm
        action={updateNote.bind(null, id)}
        submitLabel="Save Changes"
        mode="edit"
        noteId={id}
        defaultValues={{
          title: note.title,
          content: note.content,
          tags
        }}
      />
    </AppShell>
  );
}
