import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const rating = await prisma.pvpRating.findUnique({ where: { userId } });

  const recentMatches = await prisma.pvpMatch.findMany({
    where: {
      status: "completed",
      OR: [{ player1Id: userId }, { player2Id: userId }],
    },
    orderBy: { endedAt: "desc" },
    take: 10,
    include: {
      challenge: { select: { title: true } },
      player1: { select: { id: true, name: true } },
      player2: { select: { id: true, name: true } },
    },
  });

  const matches = recentMatches.map((m: typeof recentMatches[number]) => {
    const opponent = m.player1Id === userId ? m.player2 : m.player1;
    const isWinner = m.winnerId === userId;
    const isDraw = !m.winnerId;
    return {
      id: m.id,
      challenge: m.challenge.title,
      opponent: opponent?.name || "Unknown",
      result: isDraw ? "Ничья" : isWinner ? "Победа" : "Поражение",
      date: m.endedAt,
    };
  });

  return NextResponse.json({
    rating: rating?.rating ?? 1000,
    wins: rating?.wins ?? 0,
    losses: rating?.losses ?? 0,
    streak: rating?.streak ?? 0,
    matches,
  });
}
