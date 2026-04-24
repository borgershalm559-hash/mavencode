export type LessonType = "code" | "fill-blanks" | "fix-bug" | "quiz";

export interface TestCase {
  input: string;
  expected: string;
  description: string;
}

export interface LessonContent {
  title: string;
  order: number;
  type: LessonType;
  language: "python";
  xpReward: number;
  content: string;      // markdown body
  starterCode: string;
  solution: string;
  tests: TestCase[];
  hints: string[];      // exactly 3 entries (soft / concrete / full-solution)
  isAvailable: boolean;
}
