"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { DataTable } from "@/components/admin/data-table";
import { Plus, Loader2 } from "lucide-react";

interface NewsRow {
  id: string;
  title: string;
  category: string;
  pinned: boolean;
  createdAt: string;
}

export default function AdminNewsPage() {
  const { data, isLoading, mutate } = useSWR<NewsRow[]>("/api/admin/news", fetcher);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !category.trim()) return;
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), category: category.trim(), body: body.trim() }),
    });
    if (res.ok) {
      setTitle(""); setCategory(""); setBody("");
      setCreating(false);
      mutate();
    }
  };

  const handleDelete = async (item: NewsRow) => {
    if (!confirm(`Удалить "${item.title}"?`)) return;
    await fetch(`/api/admin/news/${item.id}`, { method: "DELETE" });
    mutate();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90">Новости</h1>
        <button onClick={() => setCreating(!creating)} className="flex items-center gap-2 px-4 py-2 border-2 border-black text-xs font-mono font-medium bg-[#10B981] text-black uppercase tracking-[0.08em] hover:bg-[#047857] transition-all" style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.50)" }}>
          <Plus className="w-4 h-4" />Создать
        </button>
      </div>

      {creating && (
        <div className="mb-6 bg-surface border-2 border-white/[0.07] p-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" className="w-full h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 outline-none focus:border-[#10B981]/40 font-mono" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Категория" className="w-full h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 outline-none focus:border-[#10B981]/40 font-mono" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Содержание (Markdown)" className="w-full h-32 px-3 py-2 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 outline-none resize-none focus:border-[#10B981]/40 font-mono" />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-4 py-2 border-2 border-[#10B981]/30 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] transition-all">Создать</button>
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70 transition-all">Отмена</button>
          </div>
        </div>
      )}

      <DataTable
        columns={[
          { key: "title", header: "Заголовок" },
          { key: "category", header: "Категория" },
          { key: "pinned", header: "Закреплено", render: (item: NewsRow) => item.pinned ? "Да" : "Нет" },
        ]}
        data={data || []}
        onDelete={handleDelete}
      />
    </div>
  );
}
