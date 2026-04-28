"use client";

import type { LessonDraft, LessonType, LessonLanguage } from "./types";

const TYPES: { value: LessonType; label: string }[] = [
  { value: "code", label: "Код" },
  { value: "quiz", label: "Тест" },
  { value: "fix-bug", label: "Найди-баг" },
  { value: "fill-blanks", label: "Заполни пропуски" },
];

const LANGUAGES: { value: LessonLanguage; label: string }[] = [
  { value: "python", label: "Python" },
  { value: "html", label: "HTML / CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
];

interface Props {
  draft: LessonDraft;
  onChange: (patch: Partial<LessonDraft>) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  fontWeight: 700,
  marginBottom: 6,
  display: "block",
};

const inputClass =
  "w-full h-9 px-3 bg-[#0B0B0C] border-2 border-white/[0.08] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono";

export function MetadataBar({ draft, onChange }: Props) {
  return (
    <div className="border-2 border-white/[0.07] bg-[#0F1011] p-4 space-y-3">
      {/* Title */}
      <div>
        <label className="font-mono" style={labelStyle}>Название урока</label>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Например: Первый заголовок <h1>"
          className={inputClass}
        />
      </div>

      {/* Type radio + Language + XP + Order + flags in one grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_100px_80px] gap-3">
        <div>
          <span className="font-mono" style={labelStyle}>Тип</span>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => {
              const active = draft.type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChange({ type: t.value })}
                  className="font-mono text-[11px]"
                  style={{
                    padding: "6px 10px",
                    border: `2px solid ${active ? "#10B981" : "rgba(255,255,255,0.08)"}`,
                    background: active ? "rgba(16,185,129,0.1)" : "transparent",
                    color: active ? "#10B981" : "rgba(255,255,255,0.55)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="font-mono" style={labelStyle}>Язык</label>
          <select
            value={draft.language}
            onChange={(e) => onChange({ language: e.target.value as LessonLanguage })}
            className={inputClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-mono" style={labelStyle}>XP</label>
          <input
            type="number"
            min={0}
            max={500}
            value={draft.xpReward}
            onChange={(e) => onChange({ xpReward: Math.max(0, Math.min(500, parseInt(e.target.value) || 0)) })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="font-mono" style={labelStyle}>Порядок</label>
          <input
            type="number"
            value={draft.order}
            readOnly
            title="Порядок меняется через drag-drop в списке курса"
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
        </div>
      </div>
    </div>
  );
}
