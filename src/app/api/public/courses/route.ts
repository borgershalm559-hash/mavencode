import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public, unauthenticated list of top published courses for the landing.
 * Excludes user-specific data (progress, completion). Distinct from
 * `/api/courses` which requires auth context.
 */
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        description: true,
        iconText: true,
        color: true,
        difficulty: true,
        tags: true,
        _count: { select: { lessons: true } },
      },
    });

    return NextResponse.json(
      courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        iconText: c.iconText,
        color: c.color,
        difficulty: c.difficulty,
        tags: c.tags,
        lessonCount: c._count.lessons,
      })),
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json([]);
  }
}
