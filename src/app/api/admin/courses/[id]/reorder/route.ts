import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/admin/courses/[id]/reorder
 *
 * Body: { items: [{ id: string, order: number }, ...] }
 *
 * Bulk-updates `order` for all listed lessons. Verifies each lesson
 * actually belongs to the course before updating (prevents cross-course
 * IDOR via crafted body).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id: courseId } = await params;
  const body = await req.json().catch(() => ({}));
  const items = Array.isArray(body?.items) ? body.items : null;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }

  // Verify every id in the payload belongs to this course
  const ids = items.map((i: { id: string }) => i.id).filter((x: unknown) => typeof x === "string");
  const existing = await prisma.lesson.findMany({
    where: { id: { in: ids }, courseId },
    select: { id: true },
  });
  if (existing.length !== ids.length) {
    return NextResponse.json({ error: "Some lessons not in this course" }, { status: 400 });
  }

  // Two-phase update to avoid the unique-constraint trap
  // (most schemas don't have @@unique([courseId, order]) but be safe).
  const PHASE_OFFSET = 10000;
  await prisma.$transaction([
    ...items.map((i: { id: string; order: number }) =>
      prisma.lesson.update({
        where: { id: i.id },
        data: { order: i.order + PHASE_OFFSET },
      })
    ),
    ...items.map((i: { id: string; order: number }) =>
      prisma.lesson.update({
        where: { id: i.id },
        data: { order: i.order },
      })
    ),
  ]);

  return NextResponse.json({ ok: true });
}
