// Shared types for the lesson editor.

import type { IoTestCase, HtmlAssertion, LessonType, LessonLanguage } from "@/../prisma/content/types";

export type { IoTestCase, HtmlAssertion, LessonType, LessonLanguage };

export interface LessonDraft {
  title: string;
  type: LessonType;
  language: LessonLanguage;
  xpReward: number;
  order: number;
  isAvailable: boolean;
  isPublished: boolean;
  content: string;
  starterCode: string;
  solution: string;
  // tests are stored as JSON string in DB; in editor as parsed array
  tests: IoTestCase[] | HtmlAssertion[];
  hints: string[]; // exactly 3
}

export interface LessonApiPayload {
  id: string;
  title: string;
  content: string;
  order: number;
  type: string;
  language: string;
  starterCode: string | null;
  solution: string | null;
  tests: string | null;
  hints: string | null;
  xpReward: number;
  isPublished: boolean;
  isAvailable?: boolean;
}

export function apiToDraft(api: LessonApiPayload): LessonDraft {
  let tests: IoTestCase[] | HtmlAssertion[] = [];
  if (api.tests) {
    try { tests = JSON.parse(api.tests); } catch { tests = []; }
  }
  let hints: string[] = ["", "", ""];
  if (api.hints) {
    try {
      const parsed = JSON.parse(api.hints);
      if (Array.isArray(parsed)) {
        hints = [parsed[0] ?? "", parsed[1] ?? "", parsed[2] ?? ""];
      }
    } catch { /* keep defaults */ }
  }
  return {
    title: api.title,
    type: (api.type as LessonType) ?? "code",
    language: (api.language as LessonLanguage) ?? "python",
    xpReward: api.xpReward,
    order: api.order,
    isAvailable: api.isAvailable ?? true,
    isPublished: api.isPublished,
    content: api.content,
    starterCode: api.starterCode ?? "",
    solution: api.solution ?? "",
    tests,
    hints,
  };
}

export function draftToApiBody(d: LessonDraft) {
  return {
    title: d.title,
    type: d.type,
    language: d.language,
    xpReward: d.xpReward,
    order: d.order,
    isPublished: d.isPublished,
    content: d.content,
    starterCode: d.starterCode,
    solution: d.solution,
    tests: JSON.stringify(d.tests),
    hints: JSON.stringify(d.hints),
  };
}
