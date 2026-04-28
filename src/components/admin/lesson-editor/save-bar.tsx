"use client";

import { ArrowLeft, Save, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Props {
  courseId: string;
  isPublished: boolean;
  saving: boolean;
  saved: boolean;
  validationErrors: string[];
  onSaveDraft: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
}

export function SaveBar({
  courseId, isPublished, saving, saved,
  validationErrors, onSaveDraft, onPublish, onUnpublish,
}: Props) {
  const canPublish = validationErrors.length === 0;

  return (
    <div
      className="sticky top-0 z-30 bg-[#0A0A0B]/95 backdrop-blur border-b-2 border-white/10 px-6 py-3 flex items-center gap-3 flex-wrap"
      style={{ marginLeft: -24, marginRight: -24 }}
    >
      <Link
        href={`/admin/courses/${courseId}`}
        className="inline-flex items-center gap-2 font-mono text-[11px] text-white/45 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        К курсу
      </Link>

      <span className="w-px h-5 bg-white/10" />

      {/* Status pill */}
      <span
        className="font-mono text-[10px] px-2.5 py-1 border-2"
        style={{
          letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
          color: isPublished ? "#10B981" : "rgba(255,255,255,0.4)",
          borderColor: isPublished ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.1)",
          background: isPublished ? "rgba(16,185,129,0.08)" : "transparent",
        }}
      >
        {isPublished ? "Опубликован" : "Черновик"}
      </span>

      {/* Saved indicator */}
      {saved && !saving && (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#10B981]/70" style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>
          <CheckCircle2 size={12} />
          Сохранено
        </span>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={saving}
        className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-white/[0.10] text-white/70 hover:text-white hover:border-white/20 disabled:opacity-50"
        style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        Сохранить
      </button>

      {isPublished ? (
        <button
          type="button"
          onClick={onUnpublish}
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
          onClick={onPublish}
          disabled={saving || !canPublish}
          title={canPublish ? "Опубликовать урок для студентов" : `Сначала исправь: ${validationErrors[0]}`}
          className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#10B981] text-black hover:bg-[#0da876] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, boxShadow: canPublish ? "3px 3px 0 0 rgba(16,185,129,0.5)" : "none" }}
        >
          <Eye size={12} />
          Опубликовать
        </button>
      )}
    </div>
  );
}
