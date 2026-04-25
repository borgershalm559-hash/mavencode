import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PYTHON_101_LESSONS } from "../prisma/content/python-101";
import type { LessonContent, IoTestCase } from "../prisma/content/python-101/types";

function runPython(code: string): string {
  const tmp = join(tmpdir(), `py-verify-${Date.now()}-${Math.random().toString(36).slice(2)}.py`);
  writeFileSync(tmp, code);
  try {
    const out = execFileSync("python", [tmp], {
      encoding: "utf8",
      timeout: 5000,
      // Force Python to read source and write stdout as UTF-8 regardless of
      // OS codepage. Without this, Cyrillic test expectations fail on Windows
      // because Python defaults to cp1251 stdout.
      env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" },
    });
    return out.trim();
  } finally {
    unlinkSync(tmp);
  }
}

function verifyLesson(lesson: LessonContent): { ok: boolean; failures: string[] } {
  const failures: string[] = [];
  if (lesson.tests.length === 0) return { ok: true, failures: [] };

  // Python lessons always use IoTestCase shape.
  for (const test of lesson.tests as IoTestCase[]) {
    try {
      const code = `${lesson.solution}\nprint(${test.input})`;
      const actual = runPython(code);
      if (actual !== test.expected) {
        failures.push(`  [${test.description}] expected "${test.expected}", got "${actual}"`);
      }
    } catch (e) {
      failures.push(`  [${test.description}] runtime error: ${(e as Error).message.slice(0, 200)}`);
    }
  }
  return { ok: failures.length === 0, failures };
}

let totalFailures = 0;
for (const lesson of PYTHON_101_LESSONS) {
  if (lesson.title === "PLACEHOLDER") {
    console.log(`⏸  Lesson ${lesson.order}: PLACEHOLDER (skipped)`);
    continue;
  }
  // Quiz-type lessons store multiple-choice questions in tests[]; the runner
  // should not try to execute them as Python.
  if (lesson.type === "quiz") {
    console.log(`📝 Lesson ${lesson.order}: ${lesson.title} — quiz (${lesson.tests.length} questions, not executed)`);
    continue;
  }
  const result = verifyLesson(lesson);
  if (result.ok) {
    console.log(`✅ Lesson ${lesson.order}: ${lesson.title} — ${lesson.tests.length} tests pass`);
  } else {
    console.log(`❌ Lesson ${lesson.order}: ${lesson.title}`);
    for (const f of result.failures) console.log(f);
    totalFailures += result.failures.length;
  }
}

console.log(`\n${totalFailures === 0 ? "✅ All lessons verified" : `❌ ${totalFailures} test failures`}`);
process.exit(totalFailures === 0 ? 0 : 1);
