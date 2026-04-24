"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { DataTable } from "@/components/admin/data-table";
import { Plus, Loader2 } from "lucide-react";

interface LibRow {
  id: string;
  title: string;
  kind: string;
  size: string;
}

export default function AdminLibraryPage() {
  const { data, isLoading, mutate } = useSWR<LibRow[]>("/api/admin/library", fetcher);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("Статья");
  const [body, setBody] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;
    const res = await fetch("/api/admin/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), kind, size: "~5 мин", body: body.trim() }),
    });
    if (res.ok) {
      setTitle(""); setBody("");
      setCreating(false);
      mutate();
    }
  };

  const handleDelete = async (item: LibRow) => {
    if (!confirm(`Удалить "${item.title}"?`)) return;
    await fetch(`/api/admin/library/${item.id}`, { method: "DELETE" });
    mutate();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90">Библиотека</h1>
        <button onClick={() => setCreating(!creating)} className="flex items-center gap-2 px-4 py-2 border-2 border-black text-xs font-mono font-medium bg-[#10B981] text-black uppercase tracking-[0.08em] hover:bg-[#047857] transition-all" style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.50)" }}>
          <Plus className="w-4 h-4" />Создать
        </button>
      </div>

      {creating && (
        <div className="mb-6 bg-surface border-2 border-white/[0.07] p-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" className="w-full h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 outline-none focus:border-[#10B981]/40 font-mono" />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full h-10 px-3 bg-surface border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono">
            <option value="Статья">Статья</option>
            <option value="Шпаргалка">Шпаргалка</option>
            <option value="Гайд">Гайд</option>
            <option value="Видео">Видео</option>
          </select>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Содержание (Markdown)" className="w-full h-32 px-3 py-2 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 outline-none resize-none focus:border-[#10B981]/40 font-mono" />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-4 py-2 border-2 border-[#10B981]/30 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] transition-all">Создать</button>
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70 transition-all">Отмена</button>
          </div>
        </div>
      )}

      <DataTable
        columns={[
          { key: "title", header: "Название" },
          { key: "kind", header: "Тип" },
          { key: "size", header: "Размер" },
        ]}
        data={data || []}
        onDelete={handleDelete}
      />
    </div>
  );
}
