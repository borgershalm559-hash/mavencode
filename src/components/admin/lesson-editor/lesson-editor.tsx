"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { Loader2, Trash2, X, AlertTriangle } from "lucide-react";
import { SaveBar } from "./save-bar";
import { MetadataBar } from "./metadata-bar";
import { MarkdownEditor } from "./markdown-editor";
import { CodePair } from "./code-pair";
import { TestBuilder } from "./test-builder";
import { HintsBlock } from "./hints-block";
import { useLessonDraft } from "./use-lesson-draft";
import { apiToDraft, draftToApiBody, type LessonApiPayload, type LessonDraft } from "./types";

interface Props {
  courseId: string;
  lessonId: string;
}

function validate(d: LessonDraft): string[] {
  const errors: string[] = [];
  if (!d.title.trim() || d.title.trim().length < 3) errors.push("Название урока (минимум 3 символа)");
  if (!d.content.trim() || d.content.trim().length < 100) errors.push("Теория (минимум 100 символов)");
  if (d.type !== "quiz") {
    if (!d.starterCode.trim()) errors.push("Стартовый код");
    if (!d.solution.trim()) errors.push("Решение");
  }
  if (!Array.isArray(d.tests) || d.tests.length === 0) errors.push("Минимум 1 тест");
  if (d.hints.some((h) => !h?.trim())) errors.push("Все 3 подсказки заполнены");
  return errors;
}

export function LessonEditor({ courseId, lessonId }: Props) {
  const router = useRouter();
  const { data: api, isLoading } = useSWR<LessonApiPayload>(
    `/api/admin/courses/${courseId}/lessons/${lessonId}`,
    fetcher,
  );

  const [initialDraft, setInitialDraft] = useState<LessonDraft | null>(null);
  useEffect(() => {
    if (api && !initialDraft) setInitialDraft(apiToDraft(api));
  }, [api, initialDraft]);

  if (isLoading || !api || !initialDraft) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-[#10B981]/50" />
      </div>
    );
  }

  return <LoadedEditor courseId={courseId} lessonId={lessonId} initial={initialDraft} onDeleted={() => router.push(`/admin/courses/${courseId}`)} />;
}

function LoadedEditor({
  courseId, lessonId, initial, onDeleted,
}: {
  courseId: string;
  lessonId: string;
  initial: LessonDraft;
  onDeleted: () => void;
}) {
  const { draft, update, clearLocal, restoreOffer, applyRestore, dismissRestore } = useLessonDraft(lessonId, initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const validationErrors = useMemo(() => validate(draft), [draft]);

  async function persist(extra?: Partial<LessonDraft>) {
    setSaving(true);
    setSaved(false);
    try {
      const body = draftToApiBody({ ...draft, ...extra });
      const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(String(res.status));
      if (extra?.isPublished !== undefined) update({ isPublished: extra.isPublished });
      clearLocal();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLesson() {
    if (deleteText !== draft.title) return;
    const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, { method: "DELETE" });
    if (res.ok) {
      clearLocal();
      onDeleted();
    } else {
      alert("Не удалось удалить");
    }
  }

  return (
    <div className="space-y-4">
      <SaveBar
        courseId={courseId}
        isPublished={draft.isPublished}
        saving={saving}
        saved={saved}
        validationErrors={validationErrors}
        onSaveDraft={() => persist()}
        onPublish={() => persist({ isPublished: true })}
        onUnpublish={() => persist({ isPublished: false })}
      />

      {/* Restore offer banner */}
      {restoreOffer && (
        <div className="flex items-center justify-between gap-4 p-3 border-2 border-amber-500/40 bg-amber-500/[0.06] font-mono text-[11px]">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle size={14} />
            Найдено несохранённое изменение от {new Date(restoreOffer.savedAt).toLocaleString("ru-RU")}
          </div>
          <div className="flex gap-2">
            <button onClick={applyRestore} className="px-3 py-1 border-2 border-amber-500/40 text-amber-300 hover:bg-amber-500/[0.1]">Восстановить</button>
            <button onClick={dismissRestore} className="px-3 py-1 text-white/40 hover:text-white"><X size={12} /></button>
          </div>
        </div>
      )}

      {/* Validation errors banner */}
      {validationErrors.length > 0 && (
        <div className="p-3 border border-white/[0.08] bg-black/30 font-mono text-[11px]">
          <div className="text-white/45 mb-1" style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Перед публикацией нужно заполнить:
          </div>
          <ul className="text-white/65 space-y-0.5">
            {validationErrors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        </div>
      )}

      <MetadataBar draft={draft} onChange={update} />

      <MarkdownEditor value={draft.content} onChange={(content) => update({ content })} />

      {draft.type !== "quiz" && (
        <CodePair
          language={draft.language}
          starterCode={draft.starterCode}
          solution={draft.solution}
          onChange={(p) => update(p)}
        />
      )}

      <TestBuilder draft={draft} onChange={update} />

      <HintsBlock hints={draft.hints} onChange={(hints) => update({ hints })} />

      {/* Danger zone */}
      <div className="border-2 border-red-500/30 bg-red-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 mt-0.5" />
          <div className="flex-1">
            <div className="font-mono text-[11px] text-red-400 mb-2" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
              Опасная зона
            </div>
            <p className="text-white/55 text-[12px] mb-3">
              Удаление урока необратимо. Прогресс студентов по этому уроку также удалится.
            </p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-400 text-red-400 hover:bg-red-500/[0.08]"
                style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
              >
                <Trash2 size={12} />
                Удалить урок
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-white/65 text-[12px]">
                  Введите название урока <code className="text-red-400 px-1 bg-red-500/[0.08]">{draft.title}</code> чтобы подтвердить:
                </p>
                <input
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  className="w-full max-w-md h-8 px-2 bg-[#0B0B0C] border-2 border-red-500/30 text-sm text-white outline-none focus:border-red-500 font-mono"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={deleteLesson}
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
      </div>
    </div>
  );
}
