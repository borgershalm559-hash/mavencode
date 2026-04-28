"use client";

import { useEffect, useRef, useState } from "react";
import type { LessonDraft } from "./types";

const KEY = (lessonId: string) => `lesson-draft-${lessonId}`;
const AUTOSAVE_INTERVAL_MS = 5000;

interface StoredDraft {
  draft: LessonDraft;
  savedAt: string;
  basedOnServerId: string;
}

export function useLessonDraft(lessonId: string, initial: LessonDraft) {
  const [draft, setDraft] = useState<LessonDraft>(initial);
  const [restoreOffer, setRestoreOffer] = useState<StoredDraft | null>(null);
  const dirty = useRef(false);

  // On mount: check if a localStorage draft exists and offer to restore.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY(lessonId));
      if (!raw) return;
      const stored = JSON.parse(raw) as StoredDraft;
      // Only offer if it's actually different
      if (JSON.stringify(stored.draft) !== JSON.stringify(initial)) {
        setRestoreOffer(stored);
      } else {
        localStorage.removeItem(KEY(lessonId));
      }
    } catch {
      localStorage.removeItem(KEY(lessonId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Periodic auto-save while dirty
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = setInterval(() => {
      if (!dirty.current) return;
      const stored: StoredDraft = {
        draft,
        savedAt: new Date().toISOString(),
        basedOnServerId: lessonId,
      };
      try { localStorage.setItem(KEY(lessonId), JSON.stringify(stored)); } catch { /* quota */ }
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [draft, lessonId]);

  function update(patch: Partial<LessonDraft>) {
    dirty.current = true;
    setDraft((d) => ({ ...d, ...patch }));
  }

  function clearLocal() {
    dirty.current = false;
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(KEY(lessonId)); } catch { /* noop */ }
    }
  }

  function applyRestore() {
    if (restoreOffer) {
      setDraft(restoreOffer.draft);
      dirty.current = true;
      setRestoreOffer(null);
    }
  }
  function dismissRestore() {
    setRestoreOffer(null);
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(KEY(lessonId)); } catch { /* noop */ }
    }
  }

  return {
    draft,
    update,
    setDraft,
    clearLocal,
    restoreOffer,
    applyRestore,
    dismissRestore,
  };
}
