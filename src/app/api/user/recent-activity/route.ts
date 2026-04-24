import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export interface RecentActivityItem {
  kind: "lesson" | "xp" | "achievement" | "pvp" | "course";
  title: string;
  sub: string;
  t: string;
}

function relTime(d: Date): string {
  const hrs = Math.floor((Date.now() - d.getTime()) / 3_600_000);
  const days = Math.floor(hrs / 24);
  if (hrs < 1) return "только что";
  if (hrs < 24) return `${hrs} ч назад`;
  if (days === 1) return "вчера";
  if (days < 7) return `${days} дн назад`;
  return `${Math.floor(days / 7)} нед назад`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 });
  }

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id, completed: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      createdAt: true,
      lesson: {
        select: {
          title: true,
          xpReward: true,
          course: { select: { title: true } },
        },
      },
    },
  });

  const items: RecentActivityItem[] = progress.map((p) => ({
    kind: "lesson",
    title: p.lesson.title,
    sub: `+${p.lesson.xpReward} XP · ${p.lesson.course.title}`,
    t: relTime(p.createdAt),
  }));

  return NextResponse.json(items);
}
