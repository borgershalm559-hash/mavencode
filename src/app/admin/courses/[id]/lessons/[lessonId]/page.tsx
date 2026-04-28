import { LessonEditor } from "@/components/admin/lesson-editor/lesson-editor";

interface Params {
  id: string;
  lessonId: string;
}

export default async function AdminLessonEditorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id, lessonId } = await params;
  return <LessonEditor courseId={id} lessonId={lessonId} />;
}
