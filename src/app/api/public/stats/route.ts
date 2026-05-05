import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public stats for the landing / auth page.
 * Returns: total students, lessons solved today.
 * No authentication required.
 */
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [students, solvedTodayAgg] = await Promise.all([
      prisma.user.count(),
      prisma.activityLog.aggregate({
        _sum: { count: true },
        where: { type: "lesson", date: today },
      }),
    ]);

    return NextResponse.json(
      {
        students,
        solvedToday: solvedTodayAgg._sum.count ?? 0,
      },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } }
    );
  } catch {
    // Fail soft — landing page still renders with zeros if DB is unreachable.
    return NextResponse.json({ students: 0, solvedToday: 0 });
  }
}
