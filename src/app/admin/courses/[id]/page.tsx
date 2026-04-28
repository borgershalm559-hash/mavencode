"use client";

import { useState, use } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LessonListSortable } from "@/components/admin/lesson-list-sortable";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

interface CourseData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  estimatedHours: number;
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
  const { data: course, isLoading, mutate } = useSWR<CourseData>(`/api/admin/courses/${id}`, fetcher);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [hours, setHours] = useState(1);
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");

  const startEdit = () => {
    if (!course) return;
    setTitle(course.title);
    setDescription(course.description);
    setTags(course.tags.join(", "));
    setDifficulty(course.difficulty);
    setHours(course.estimatedHours);
    setEditing(true);
  };

  const saveCourse = async () => {
    await fetch(`/api/admin/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        difficulty,
        estimatedHours: hours,
      }),
    });
    setEditing(false);
    mutate();
  };

  const createLesson = async () => {
    if (!lessonTitle.trim()) return;
    await fetch(`/api/admin/courses/${id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: lessonTitle.trim() }),
    });
    setLessonTitle("");
    setCreatingLesson(false);
    mutate();
  };

  const deleteLesson = async (lesson: { id: string }) => {
    if (!confirm("Удалить урок?")) return;
    await fetch(`/api/admin/courses/${id}/lessons/${lesson.id}`, { method: "DELETE" });
    mutate();
  };

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/courses" className="flex items-center gap-2 text-xs text-white/30 font-mono hover:text-white/60 mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Назад к курсам
      </Link>

      {/* Course info */}
      <div className="bg-surface border-2 border-white/[0.07] p-5 mb-6">
        {editing ? (
          <div className="space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-20 px-3 py-2 bg-surface border-2 border-white/[0.07] text-sm text-white outline-none resize-none focus:border-[#10B981]/40 font-mono" />
            <div className="grid grid-cols-3 gap-3">
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Теги (через запятую)" className="h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono" />
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <input type="number" value={hours} onChange={(e) => setHours(parseInt(e.target.value) || 1)} className="h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono" />
            </div>
            <div className="flex gap-2">
              <button onClick={saveCourse} className="px-4 py-2 border-2 border-[#10B981]/30 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] transition-all">Сохранить</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70 transition-all">Отмена</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-bold font-mono text-white/90">{course.title}</h1>
                <p className="text-sm text-white/40 mt-1">{course.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-white/30 font-mono">
                  <span>{course.difficulty}</span>
                  <span>{course.estimatedHours}ч</span>
                  <span>{course.tags.join(", ")}</span>
                </div>
              </div>
              <button onClick={startEdit} className="px-3 py-1.5 border border-[#10B981]/20 text-xs font-mono text-[#10B981]/80 hover:text-[#10B981] hover:bg-[#10B981]/[0.06] transition-all">
                Редактировать
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold font-mono text-white/50 uppercase tracking-[0.15em]">Уроки ({course.lessons.length})</h2>
        <button
          onClick={() => setCreatingLesson(!creatingLesson)}
          className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#10B981]/25 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить урок
        </button>
      </div>

      {creatingLesson && (
        <div className="mb-4 bg-surface border-2 border-white/[0.07] p-4 flex gap-2">
          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="Название урока"
            className="flex-1 h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono"
          />
          <button onClick={createLesson} className="px-4 py-2 border-2 border-[#10B981]/30 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] transition-all">Создать</button>
          <button onClick={() => setCreatingLesson(false)} className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70 transition-all">Отмена</button>
        </div>
      )}

      <LessonListSortable
        courseId={id}
        lessons={course.lessons}
        onReorder={() => mutate()}
        onDelete={deleteLesson}
      />
    </div>
  );
}
