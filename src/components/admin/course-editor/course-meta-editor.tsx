"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export interface CourseMeta {
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  tags: string[];
  isPublished: boolean;
  image: string | null;
  iconText: string | null;
  color: string | null;
}

interface Props {
  initial: CourseMeta;
  onSave: (meta: CourseMeta) => Promise<void>;
}

const DIFFICULTIES = [
  { value: "beginner", label: "Начальный", color: "#10B981" },
  { value: "intermediate", label: "Средний", color: "#F59E0B" },
  { value: "advanced", label: "Продвинутый", color: "#EF4444" },
];

const SUGGESTED_COLORS = ["#06B6D4", "#10B981", "#A78BFA", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];

const inputClass =
  "w-full h-9 px-3 bg-[#0B0B0C] border-2 border-white/[0.08] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono";
const textareaClass =
  "w-full px-3 py-2 bg-[#0B0B0C] border-2 border-white/[0.08] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono resize-y";
const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  fontWeight: 700,
  marginBottom: 6,
  display: "block",
};

export function CourseMetaEditor({ initial, onSave }: Props) {
  const [meta, setMeta] = useState<CourseMeta>(initial);
  const [tagDraft, setTagDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const initialRef = useRef(JSON.stringify(initial));

  useEffect(() => {
    setDirty(JSON.stringify(meta) !== initialRef.current);
  }, [meta]);

  function update<K extends keyof CourseMeta>(key: K, value: CourseMeta[K]) {
    setMeta((prev) => ({ ...prev, [key]: value }));
  }

  function addTag() {
    const t = tagDraft.trim();
    if (!t || meta.tags.includes(t)) return;
    update("tags", [...meta.tags, t]);
    setTagDraft("");
  }
  function removeTag(t: string) {
    update("tags", meta.tags.filter((x) => x !== t));
  }
  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagDraft && meta.tags.length > 0) {
      update("tags", meta.tags.slice(0, -1));
    }
  }

  async function handleSave(extra?: Partial<CourseMeta>) {
    setSaving(true);
    setSaved(false);
    try {
      const next = { ...meta, ...extra };
      setMeta(next);
      await onSave(next);
      initialRef.current = JSON.stringify(next);
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const diff = DIFFICULTIES.find((d) => d.value === meta.difficulty);
  const validForPublish = meta.title.trim().length >= 3 && meta.description.trim().length >= 20;

  return (
    <div className="border-2 border-white/[0.07] bg-[#0F1011]">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-white/[0.07] flex-wrap">
        <span
          className="font-mono text-[10px] px-2 py-1 border-2"
          style={{
            letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
            color: meta.isPublished ? "#10B981" : "rgba(255,255,255,0.4)",
            borderColor: meta.isPublished ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.1)",
            background: meta.isPublished ? "rgba(16,185,129,0.08)" : "transparent",
          }}
        >
          {meta.isPublished ? "Опубликован" : "Черновик"}
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
          onClick={() => handleSave()}
          disabled={saving || !dirty}
          className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-white/[0.10] text-white/70 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : null}
          Сохранить
        </button>

        {meta.isPublished ? (
          <button
            type="button"
            onClick={() => handleSave({ isPublished: false })}
            disabled={saving}
            className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/[0.08] disabled:opacity-50"
            style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
          >
            <EyeOff size={12} />
            Снять с публикации
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSave({ isPublished: true })}
            disabled={saving || !validForPublish}
            title={validForPublish ? "Опубликовать курс" : "Заполните название и описание"}
            className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#10B981] text-black hover:bg-[#0da876] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, boxShadow: validForPublish ? "3px 3px 0 0 rgba(16,185,129,0.5)" : "none" }}
          >
            <Eye size={12} />
            Опубликовать
          </button>
        )}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 p-5">
        {/* Left — main fields */}
        <div className="space-y-4">
          <div>
            <label style={labelStyle} className="font-mono">Название</label>
            <input value={meta.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
          </div>

          <div>
            <label style={labelStyle} className="font-mono">Описание</label>
            <textarea
              value={meta.description}
              onChange={(e) => update("description", e.target.value)}
              className={textareaClass}
              style={{ minHeight: 90 }}
              placeholder="Что узнает студент после прохождения курса"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span style={labelStyle} className="font-mono">Сложность</span>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => {
                  const active = meta.difficulty === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => update("difficulty", d.value)}
                      className="font-mono text-[11px]"
                      style={{
                        padding: "6px 10px",
                        border: `2px solid ${active ? d.color : "rgba(255,255,255,0.08)"}`,
                        background: active ? `${d.color}1A` : "transparent",
                        color: active ? d.color : "rgba(255,255,255,0.55)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle} className="font-mono">Часов на курс</label>
              <input
                type="number"
                min={1}
                max={500}
                value={meta.estimatedHours}
                onChange={(e) => update("estimatedHours", Math.max(1, parseInt(e.target.value) || 1))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle} className="font-mono">Теги</label>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
              {meta.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] border"
                  style={{
                    color: "#10B981", background: "rgba(16,185,129,0.06)",
                    borderColor: "rgba(16,185,129,0.25)",
                  }}
                >
                  {t}
                  <button onClick={() => removeTag(t)} className="text-[#10B981]/60 hover:text-[#10B981]">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={onTagKeyDown}
                placeholder="Добавить тег и нажать Enter"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagDraft.trim()}
                className="font-mono text-[11px] px-3 border-2 border-white/[0.10] text-white/70 hover:text-white disabled:opacity-30"
                style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                <Plus size={12} className="inline" />
              </button>
            </div>
            <div className="font-mono text-[10px] text-white/30 mt-1">
              Используются для треков на странице курсов. Регистр не важен.
            </div>
          </div>
        </div>

        {/* Right — branding column */}
        <div className="space-y-4">
          <div>
            <label style={labelStyle} className="font-mono">Иконка курса (текст)</label>
            <input
              value={meta.iconText ?? ""}
              onChange={(e) => update("iconText", e.target.value)}
              placeholder="PY 101"
              maxLength={8}
              className={inputClass}
            />
            <div className="font-mono text-[10px] text-white/30 mt-1">
              Короткий код 2-8 символов для квадратной плашки
            </div>
          </div>

          <div>
            <label style={labelStyle} className="font-mono">Цвет бренда</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SUGGESTED_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("color", c)}
                  className="size-7 border-2"
                  style={{
                    background: c,
                    borderColor: meta.color === c ? "#fff" : "transparent",
                  }}
                  title={c}
                />
              ))}
              {meta.color && (
                <button
                  type="button"
                  onClick={() => update("color", null)}
                  className="size-7 border-2 border-white/10 text-white/30 hover:text-white grid place-items-center"
                  title="Сбросить"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <input
              value={meta.color ?? ""}
              onChange={(e) => update("color", e.target.value)}
              placeholder="#06B6D4 или пусто"
              className={inputClass}
            />
          </div>

          <div>
            <label style={labelStyle} className="font-mono">URL обложки</label>
            <input
              value={meta.image ?? ""}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
            {meta.image && (
              <div className="mt-2 border-2 border-white/[0.07] aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={meta.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Live brand preview */}
          <div>
            <span style={labelStyle} className="font-mono">Превью</span>
            <div
              className="size-16 grid place-items-center font-mono font-black border-2"
              style={{
                background: meta.color ? `${meta.color}24` : "rgba(255,255,255,0.05)",
                color: meta.color ?? "#fff",
                borderColor: meta.color ? `${meta.color}55` : "rgba(255,255,255,0.1)",
                fontSize: 13,
                letterSpacing: "0.1em",
              }}
            >
              {meta.iconText || meta.title.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
