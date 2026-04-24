import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const users = await prisma.user.findMany({
    select: { id: true, name: true, image: true, level: true, xp: true, streak: true },
    orderBy: [{ xp: "desc" }, { level: "desc" }],
    take: 20,
  });

  const ranked = users.map((u, i) => ({ ...u, rank: i + 1 }));

  // Find current user rank if not in top 20
  let currentUserRank = ranked.find((u) => u.id === userId)?.rank ?? null;

  const [totalCount, currentUser] = await Promise.all([
    prisma.user.count(),
    !currentUserRank
      ? prisma.user.findUnique({ where: { id: userId }, select: { xp: true } })
      : Promise.resolve(null),
  ]);

  if (!currentUserRank && currentUser) {
    const higherCount = await prisma.user.count({
      where: { xp: { gt: currentUser.xp ?? 0 } },
    });
    currentUserRank = higherCount + 1;
  }

  return NextResponse.json({ users: ranked, currentUserRank, totalCount });
}
