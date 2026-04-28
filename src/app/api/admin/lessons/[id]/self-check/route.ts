import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/lessons/[id]/self-check
 *
 * Server-side self-check used only for quiz lessons. For each question
 * the `expected` value must be present in the option list (description
 * split on "|"). HTML and Python self-checks run client-side via the
 * existing HtmlRunner / PythonRunner inside an iframe.
 *
 * Returns:
 *   { ok: true } when every question is valid
 *   { ok: false, failingTests: [{ index, reason }] } otherwise
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (lesson.type !== "quiz") {
    return NextResponse.json(
      { error: "Server self-check only works for quiz lessons. Use the client-side runner for code lessons." },
      { status: 400 }
    );
  }

  type IoTest = { input: string; expected: string; description: string };
  let tests: IoTest[] = [];
  try {
    tests = lesson.tests ? (JSON.parse(lesson.tests) as IoTest[]) : [];
  } catch {
    return NextResponse.json(
      { ok: false, failingTests: [{ index: -1, reason: "Tests JSON is invalid" }] },
      { status: 200 }
    );
  }

  if (tests.length === 0) {
    return NextResponse.json(
      { ok: false, failingTests: [{ index: -1, reason: "No questions" }] },
      { status: 200 }
    );
  }

  const failingTests: { index: number; reason: string }[] = [];
  tests.forEach((t, i) => {
    if (!t.input?.trim()) {
      failingTests.push({ index: i, reason: "Question text is empty" });
      return;
    }
    const options = (t.description ?? "").split("|").map((o) => o.trim()).filter(Boolean);
    if (options.length < 2) {
      failingTests.push({ index: i, reason: "Need at least 2 options" });
      return;
    }
    if (!options.includes(t.expected?.trim() ?? "")) {
      failingTests.push({ index: i, reason: `Correct answer "${t.expected}" is not among the options` });
    }
  });

  return NextResponse.json(
    failingTests.length === 0 ? { ok: true } : { ok: false, failingTests }
  );
}
