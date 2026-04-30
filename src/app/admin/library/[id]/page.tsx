"use client";

import { use, useEffect, useState, useRef } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { ArrowLeft, Loader2, Save, Trash2, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { MarkdownEditor } from "@/components/admin/lesson-editor/markdown-editor";

interface LibItem {
  id: string;
  title: string;
  kind: string;
  size: string;
  body: string;
  url: string | null;
  createdAt: string;
}

const KINDS = ["Статья", "Шпаргалка", "Гайд", "Видео"];

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  fontWeight: 700,
  marginBottom: 6,
  display: "block",
};
const inputCls =
  "w-full h-9 px-3 bg-[#0B0B0C] border-2 border-white/[0.08] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono";

export default function AdminLibraryEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading, mutate } = useSWR<LibItem>(`/api/admin/library/${id}`, fetcher);

  const [draft, setDraft] = useState<LibItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const initialRef = useRef("");

  useEffect(() => {
    if (item && draft === null) {
      setDraft(item);
      initialRef.current = JSON.stringify(item);
    }
  }, [item, draft]);

  if (isLoading || !item || !draft) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" /></div>;
  }

  const dirty = JSON.stringify(draft) !== initialRef.current;

  function update<K extends keyof LibItem>(key: K, value: LibItem[K]) {
    setDraft((d) => d ? { ...d, [key]: value } : d);
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/library/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          kind: draft.kind,
          size: draft.size,
          body: draft.body,
          url: draft.url,
        }),
      });
      if (!res.ok) throw new Error();
      initialRef.current = JSON.stringify(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      mutate();
    } catch {
      alert("Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem() {
    if (!draft || deleteText !== draft.title) return;
    const res = await fetch(`/api/admin/library/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/library");
  }

  return (
    <div className="space-y-5">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-30 bg-[#0A0A0B]/95 backdrop-blur border-b-2 border-white/10 px-6 py-3 flex items-center gap-3 flex-wrap"
        style={{ marginLeft: -24, marginRight: -24 }}
      >
        <Link href="/admin/library" className="inline-flex items-center gap-2 font-mono text-[11px] text-white/45 hover:text-white">
          <ArrowLeft size={14} />
          К списку
        </Link>
        <span className="w-px h-5 bg-white/10" />
        <span
          className="font-mono text-[10px] px-2 py-1 border-2"
          style={{
            letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
            color: "rgba(255,255,255,0.55)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          {draft.kind}
        </span>
        {saved && !saving && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#10B981]/70" style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>
            <CheckCircle2 size={12} />
            Сохранено
          </span>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#10B981] text-black hover:bg-[#0da876] disabled:opacity-30"
          style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, boxShadow: dirty ? "3px 3px 0 0 rgba(16,185,129,0.5)" : "none" }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Сохранить
        </button>
      </div>

      {/* Meta */}
      <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5 space-y-4">
        <div>
          <label style={labelStyle} className="font-mono">Название</label>
          <input value={draft.title} onChange={(e) => update("title", e.target.value)} className={inputCls} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span style={labelStyle} className="font-mono">Тип</span>
            <div className="flex gap-2 flex-wrap">
              {KINDS.map((k) => {
                const active = draft.kind === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => update("kind", k)}
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

          <div>
            <label style={labelStyle} className="font-mono">Размер / Длительность</label>
            <input
              value={draft.size}
              onChange={(e) => update("size", e.target.value)}
              placeholder="например: ~5 мин, 12 мин видео, 2 страницы"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle} className="font-mono">Внешняя ссылка (необязательно)</label>
          <div className="flex gap-2">
            <input
              value={draft.url ?? ""}
              onChange={(e) => update("url", e.target.value || null)}
              placeholder="https://... — если материал ведёт на внешний ресурс"
              className={inputCls}
            />
            {draft.url && (
              <a
                href={draft.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3 border-2 border-white/[0.08] text-white/55 hover:text-[#10B981] hover:border-[#10B981]/30"
                title="Открыть в новой вкладке"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          <p className="text-[11px] text-white/35 mt-1.5 font-mono">
            Если указана — карточка материала может вести наружу. Тело ниже остаётся как описание.
          </p>
        </div>
      </div>

      {/* Body — markdown editor */}
      <div>
        <h2
          className="font-mono mb-3"
          style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}
        >
          § Содержание
        </h2>
        <MarkdownEditor value={draft.body} onChange={(body) => update("body", body)} context="library" />
      </div>

      {/* Danger zone */}
      <div className="border-2 border-red-500/30 bg-red-500/[0.04] p-4">
        <div className="font-mono text-[11px] text-red-400 mb-2 inline-flex items-center gap-2" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
          <AlertTriangle size={14} />
          Опасная зона
        </div>
        <p className="text-white/55 text-[12px] mb-3">
          Удаление материала необратимо.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-400 text-red-400 hover:bg-red-500/[0.08]"
            style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
          >
            <Trash2 size={12} />
            Удалить материал
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-white/65 text-[12px]">
              Введите название <code className="text-red-400 px-1 bg-red-500/[0.08]">{draft.title}</code>:
            </p>
            <input
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              autoFocus
              className="w-full max-w-md h-8 px-2 bg-[#0B0B0C] border-2 border-red-500/30 text-sm text-white outline-none focus:border-red-500 font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={deleteItem}
                disabled={deleteText !== draft.title}
                className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-red-500 text-black hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
              >
                Удалить навсегда
              </button>
              <button
                onClick={() => { setConfirmDelete(false); setDeleteText(""); }}
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
