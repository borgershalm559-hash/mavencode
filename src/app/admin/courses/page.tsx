"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { DataTable } from "@/components/admin/data-table";
import { Plus, Loader2 } from "lucide-react";

interface CourseRow {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
  isPublished: boolean;
  _count: { lessons: number };
  createdAt: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<CourseRow[]>("/api/admin/courses", fetcher);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim() }),
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setCreating(false);
      mutate();
    }
  };

  const handleDelete = async (item: CourseRow) => {
    if (!confirm(`Удалить курс "${item.title}"?`)) return;
    await fetch(`/api/admin/courses/${item.id}`, { method: "DELETE" });
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90">Курсы</h1>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black text-xs font-mono font-medium bg-[#10B981] text-black uppercase tracking-[0.08em] hover:bg-[#047857] transition-all"
          style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.50)" }}
        >
          <Plus className="w-4 h-4" />
          Создать курс
        </button>
      </div>

      {creating && (
        <div className="mb-6 bg-surface border-2 border-white/[0.07] p-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название курса"
            className="w-full h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 focus:border-[#10B981]/40 outline-none font-mono"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            className="w-full h-20 px-3 py-2 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 focus:border-[#10B981]/40 outline-none resize-none font-mono"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 border-2 border-[#10B981]/30 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] transition-all"
            >
              Создать
            </button>
            <button
              onClick={() => setCreating(false)}
              className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70 transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <DataTable
        columns={[
          { key: "title", header: "Название" },
          { key: "difficulty", header: "Сложность" },
          {
            key: "lessons",
            header: "Уроки",
            render: (item: CourseRow) => item._count.lessons,
          },
          {
            key: "tags",
            header: "Теги",
            render: (item: CourseRow) => item.tags.join(", "),
          },
          {
            key: "status",
            header: "Статус",
            render: (item: CourseRow) => (
              <span
                className="font-mono text-[9px] px-1.5 py-0.5 border"
                style={{
                  letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
                  color: item.isPublished ? "#10B981" : "rgba(255,255,255,0.4)",
                  borderColor: item.isPublished ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)",
                  background: item.isPublished ? "rgba(16,185,129,0.06)" : "transparent",
                }}
              >
                {item.isPublished ? "опубликован" : "черновик"}
              </span>
            ),
          },
        ]}
        data={data || []}
        onEdit={(item) => router.push(`/admin/courses/${item.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
