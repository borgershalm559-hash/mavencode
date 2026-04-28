"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { Plus, Loader2, Trash2, ChevronRight, BookOpen, FileText, Sparkles, Video, Link2 } from "lucide-react";

interface LibRow {
  id: string;
  title: string;
  kind: string;
  size: string;
  url: string | null;
  createdAt: string;
}

const KINDS = ["Статья", "Шпаргалка", "Гайд", "Видео"];

const KIND_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  "Статья": FileText,
  "Шпаргалка": Sparkles,
  "Гайд": BookOpen,
  "Видео": Video,
};

const SEED_BODY = (title: string) => `# ${title}\n\nНапиши содержание здесь.\n`;

export default function AdminLibraryPage() {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<LibRow[]>("/api/admin/library", fetcher);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("Статья");
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          kind,
          size: "~5 мин",
          body: SEED_BODY(title.trim()),
        }),
      });
      if (!res.ok) throw new Error();
      const item = await res.json();
      setTitle(""); setKind("Статья"); setCreating(false);
      router.push(`/admin/library/${item.id}`);
    } catch {
      alert("Не удалось создать");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: LibRow) {
    if (!confirm(`Удалить "${item.title}"?`)) return;
    await fetch(`/api/admin/library/${item.id}`, { method: "DELETE" });
    mutate();
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90">Библиотека</h1>
          <p className="text-[12px] text-white/40 font-mono mt-1">{data?.length || 0} материалов</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black text-xs font-mono font-medium bg-[#10B981] text-black uppercase tracking-[0.08em] hover:bg-[#0da876] transition-all"
          style={{ boxShadow: "3px 3px 0 0 rgba(16,185,129,0.50)" }}
        >
          <Plus className="w-4 h-4" />Создать
        </button>
      </div>

      {creating && (
        <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5 space-y-4">
          <div>
            <label className="font-mono block mb-1.5" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Название</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              placeholder="Например: Полный гайд по Git"
              className="w-full h-10 px-3 bg-[#0B0B0C] border-2 border-white/[0.08] text-sm text-white placeholder:text-white/25 outline-none focus:border-[#10B981]/40 font-mono"
            />
          </div>

          <div>
            <span className="font-mono block mb-1.5" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Тип</span>
            <div className="flex gap-2 flex-wrap">
              {KINDS.map((k) => {
                const active = kind === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
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
                    {k}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCreate}
              disabled={!title.trim() || busy}
              className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#10B981] text-black hover:bg-[#0da876] disabled:opacity-30"
              style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
            >
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Создать и открыть
            </button>
            <button
              onClick={() => { setCreating(false); setTitle(""); }}
              className="font-mono text-[11px] px-3 py-1.5 text-white/40 hover:text-white/70"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="border-2 border-white/[0.07] bg-[#0F1011]">
        {(data || []).length === 0 ? (
          <div className="p-10 text-center">
            <BookOpen size={32} className="mx-auto mb-3 text-white/20" />
            <p className="font-mono text-[12px] text-white/40">Материалов пока нет</p>
          </div>
        ) : (
          (data || []).map((item) => {
            const Icon = KIND_ICON[item.kind] || FileText;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 border-b-2 border-white/[0.05] last:border-b-0 hover:bg-white/[0.02] group"
              >
                <Icon size={14} />
                <Link
                  href={`/admin/library/${item.id}`}
                  className="flex-1 min-w-0 truncate text-[14px] text-white hover:text-[#10B981] transition-colors"
                >
                  {item.title}
                </Link>
                {item.url && <Link2 size={12} className="text-white/30" />}
                <span
                  className="font-mono text-[10px] px-2 py-0.5 border-2 hidden sm:inline-block"
                  style={{
                    letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
                    color: "rgba(255,255,255,0.55)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  {item.kind}
                </span>
                <span className="font-mono text-[10px] text-white/35 hidden md:inline-block w-16 text-right">{item.size}</span>
                <button
                  onClick={() => handleDelete(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-white/40 hover:text-red-400"
                  title="Удалить"
                >
                  <Trash2 size={14} />
                </button>
                <Link
                  href={`/admin/library/${item.id}`}
                  className="text-white/30 group-hover:text-[#10B981] transition-colors"
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
