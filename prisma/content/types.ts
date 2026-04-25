// Shared lesson types across all authored courses (python-101, html-101, ...).

export type LessonType = "code" | "fill-blanks" | "fix-bug" | "quiz";

export type LessonLanguage = "python" | "html" | "javascript" | "typescript";

/**
 * Test case for code lessons that work with text I/O (Python, JavaScript).
 *
 * Convention for `quiz` lessons:
 *   input       = question text
 *   description = options joined by " | "
 *   expected    = correct option (must match one of the options exactly)
 */
export interface IoTestCase {
  input: string;
  expected: string;
  description: string;
}

/**
 * DOM-based assertion for HTML lessons. Each assertion is one selector-driven
 * predicate on the rendered iframe DOM, with a human-readable Russian
 * `description` that is shown to the learner in the test panel.
 */
export type HtmlAssertion =
  | { kind: "exists";        selector: string;                                            description: string }
  | { kind: "count";         selector: string; n: number;                                 description: string }
  | { kind: "text";          selector: string; equals: string;                            description: string }
  | { kind: "textContains";  selector: string; contains: string;                          description: string }
  | { kind: "attr";          selector: string; name: string; equals: string;              description: string }
  | { kind: "attrExists";    selector: string; name: string;                              description: string }
  | { kind: "style";         selector: string; property: string; equals: string;          description: string }
  | { kind: "styleContains"; selector: string; property: string; contains: string;        description: string };

export interface LessonContent {
  title: string;
  order: number;
  type: LessonType;
  language: LessonLanguage;
  xpReward: number;
  content: string;
  starterCode: string;
  solution: string;
  tests: IoTestCase[] | HtmlAssertion[];
  hints: string[]; // exactly 3 entries: soft -> concrete -> full
  isAvailable: boolean;
}
