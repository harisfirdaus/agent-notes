import { redirect } from "next/navigation";

type EditCapturePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCapturePage({ params }: EditCapturePageProps) {
  const { id } = await params;
  redirect(`/notes/${id}/edit`);
}
