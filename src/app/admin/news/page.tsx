"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import { Plus, Loader2, Pin, Trash2, ExternalLink } from "lucide-react";

interface NewsRow {
  id: string;
  title: string;
  category: string;
  pinned: boolean;
  createdAt: string;
  publishedAt: string;
}

const CATEGORIES = ["Обновление", "Событие", "Объявление"];

export default function AdminNewsPage() {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<NewsRow[]>("/api/admin/news", fetcher);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  async function handleCreate() {
    if (!title.trim()) return;
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        category,
        body: `# ${title.trim()}\n\nНапиши тело новости здесь.`,
      }),
    });
    if (res.ok) {
      const item = await res.json();
      setTitle("");
      setCreating(false);
      router.push(`/admin/news/${item.id}`);
      mutate();
    }
  }

  async function handleDelete(item: NewsRow) {
    if (!confirm(`Удалить новость "${item.title}"?`)) return;
    await fetch(`/api/admin/news/${item.id}`, { method: "DELETE" });
    mutate();
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90">
          Новости ({data?.length ?? 0})
        </h1>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black text-xs font-mono font-medium bg-[#10B981] text-black uppercase tracking-[0.08em] hover:bg-[#047857]"
          style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.50)" }}
        >
          <Plus className="w-4 h-4" />Создать
        </button>
      </div>

      {creating && (
        <div className="bg-[#0F1011] border-2 border-white/[0.07] p-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            className="w-full h-10 px-3 bg-[#0B0B0C] border-2 border-white/[0.07] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="font-mono text-[11px] px-3 py-1.5"
                  style={{
                    border: `2px solid ${active ? "#10B981" : "rgba(255,255,255,0.08)"}`,
                    background: active ? "rgba(16,185,129,0.1)" : "transparent",
                    color: active ? "#10B981" : "rgba(255,255,255,0.55)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!title.trim()}
              className="px-4 py-2 border-2 border-[#10B981]/30 text-xs font-mono font-medium bg-[#10B981]/[0.08] text-[#10B981] hover:bg-[#10B981]/[0.15] disabled:opacity-30"
            >
              Создать и открыть
            </button>
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-xs font-mono text-white/40 hover:text-white/70">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {(data ?? []).map((n) => (
          <div
            key={n.id}
            className="flex items-center gap-3 px-3 py-2.5 bg-[#0F1011] border-2 border-white/[0.07] hover:border-white/[0.12]"
          >
            {n.pinned && (
              <Pin size={14} className="text-[#10B981] flex-shrink-0" fill="currentColor" />
            )}
            <Link
              href={`/admin/news/${n.id}`}
              className="flex-1 min-w-0 text-white/85 text-[13px] truncate hover:text-[#10B981]"
            >
              {n.title}
            </Link>
            <span
              className="font-mono text-[10px] px-1.5 py-0.5 border"
              style={{
                color: "rgba(255,255,255,0.55)",
                borderColor: "rgba(255,255,255,0.1)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {n.category}
            </span>
            <span className="font-mono text-[10px] text-white/35 hidden md:inline">
              {new Date(n.publishedAt).toLocaleDateString("ru-RU")}
            </span>
            <Link
              href={`/admin/news/${n.id}`}
              className="size-7 grid place-items-center text-white/40 hover:text-white"
              title="Редактировать"
            >
              <ExternalLink size={13} />
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(n)}
              className="size-7 grid place-items-center text-white/40 hover:text-red-400"
              title="Удалить"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {(data ?? []).length === 0 && !creating && (
          <div className="font-mono text-[11px] text-white/35 py-8 text-center border border-dashed border-white/[0.08]">
            Пока нет новостей. Нажмите «Создать», чтобы добавить первую.
          </div>
        )}
      </div>
    </div>
  );
}
