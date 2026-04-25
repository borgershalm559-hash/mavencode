// Re-export shared types so existing python-101 lesson files keep working
// with `import type { LessonContent } from "../types"`.
export * from "../types";
export type { IoTestCase as TestCase } from "../types";
