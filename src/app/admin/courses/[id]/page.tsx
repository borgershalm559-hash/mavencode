"use client";

import { useState, use } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import { LessonListSortable } from "@/components/admin/lesson-list-sortable";
import { CourseMetaEditor, type CourseMeta } from "@/components/admin/course-editor/course-meta-editor";
import { ArrowLeft, Plus, Loader2, Trash2 } from "lucide-react";

interface CourseData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  estimatedHours: number;
  isPublished: boolean;
  image: string | null;
  iconText: string | null;
  color: string | null;
  lessons: {
    id: string;
    title: string;
    order: number;
    type: string;
    language: string;
    xpReward: number;
    isPublished?: boolean;
  }[];
}

export default function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: course, isLoading, mutate } = useSWR<CourseData>(`/api/admin/courses/${id}`, fetcher);

  const [creatingLesson, setCreatingLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");

  const [confirmDeleteCourse, setConfirmDeleteCourse] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  async function saveMeta(meta: CourseMeta) {
    const res = await fetch(`/api/admin/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meta),
    });
    if (!res.ok) throw new Error("save failed");
    mutate();
  }

  async function createLesson() {
    if (!lessonTitle.trim()) return;
    const res = await fetch(`/api/admin/courses/${id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: lessonTitle.trim(),
        content: `# ${lessonTitle.trim()}\n\nНапиши теорию урока здесь.`,
      }),
    });
    if (res.ok) {
      const lesson = await res.json();
      setLessonTitle("");
      setCreatingLesson(false);
      router.push(`/admin/courses/${id}/lessons/${lesson.id}`);
    }
  }

  async function deleteLesson(lesson: { id: string; title: string }) {
    if (!confirm(`Удалить урок "${lesson.title}"? Прогресс студентов по этому уроку также удалится.`)) return;
    await fetch(`/api/admin/courses/${id}/lessons/${lesson.id}`, { method: "DELETE" });
    mutate();
  }

  async function deleteCourse() {
    if (!course || deleteText !== course.title) return;
    const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/courses");
  }

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" />
      </div>
    );
  }

  const initialMeta: CourseMeta = {
    title: course.title,
    description: course.description,
    difficulty: course.difficulty,
    estimatedHours: course.estimatedHours,
    tags: course.tags,
    isPublished: course.isPublished,
    image: course.image,
    iconText: course.iconText,
    color: course.color,
  };

  return (
    <div className="space-y-5">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-2 text-xs text-white/30 font-mono hover:text-white/60 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Назад к курсам
      </Link>

      <CourseMetaEditor key={course.id} initial={initialMeta} onSave={saveMeta} />

      {/* Lessons */}
      <div className="flex items-center justify-between mt-6">
        <h2 className="text-sm font-bold font-mono text-white/55 uppercase tracking-[0.15em]">
          Уроки ({course.lessons.length})
        </h2>
        <button
          onClick={() => setCreatingLesson(!creatingLesson)}
          className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#10B981]/25 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] transition-all"
          style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить урок
        </button>
      </div>

      {creatingLesson && (
        <div className="bg-[#0F1011] border-2 border-white/[0.07] p-4 flex gap-2">
          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") createLesson(); }}
            placeholder="Название нового урока"
            autoFocus
            className="flex-1 h-10 px-3 bg-[#0B0B0C] border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono"
          />
          <button
            onClick={createLesson}
            disabled={!lessonTitle.trim()}
            className="px-4 py-2 border-2 border-[#10B981]/30 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] disabled:opacity-30"
          >
            Создать и открыть
          </button>
          <button
            onClick={() => setCreatingLesson(false)}
            className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70"
          >
            Отмена
          </button>
        </div>
      )}

      <LessonListSortable
        courseId={id}
        lessons={course.lessons}
        onReorder={() => mutate()}
        onDelete={deleteLesson}
      />

      {/* Danger zone for the course itself */}
      <div className="border-2 border-red-500/30 bg-red-500/[0.04] p-4 mt-8">
        <div className="font-mono text-[11px] text-red-400 mb-2" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
          Опасная зона
        </div>
        <p className="text-white/55 text-[12px] mb-3">
          Удаление курса удалит все уроки и весь прогресс студентов по нему.
        </p>
        {!confirmDeleteCourse ? (
          <button
            onClick={() => setConfirmDeleteCourse(true)}
            className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-400 text-red-400 hover:bg-red-500/[0.08]"
            style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
          >
            <Trash2 size={12} />
            Удалить курс
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-white/65 text-[12px]">
              Введите название курса <code className="text-red-400 px-1 bg-red-500/[0.08]">{course.title}</code>:
            </p>
            <input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              autoFocus
              className="w-full max-w-md h-8 px-2 bg-[#0B0B0C] border-2 border-red-500/30 text-sm text-white outline-none focus:border-red-500 font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={deleteCourse}
                disabled={deleteText !== course.title}
                className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-red-500 text-black hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
              >
                Удалить навсегда
              </button>
              <button
                onClick={() => { setConfirmDeleteCourse(false); setDeleteText(""); }}
                className="font-mono text-[11px] px-3 py-1.5 text-white/40 hover:text-white/70"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
