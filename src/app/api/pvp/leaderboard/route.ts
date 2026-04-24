import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const top = await prisma.pvpRating.findMany({
    orderBy: { rating: "desc" },
    take: 20,
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const leaderboard = top.map((r: typeof top[number], i: number) => ({
    rank: i + 1,
    id: r.user.id,
    name: r.user.name,
    image: r.user.image,
    rating: r.rating,
    wins: r.wins,
    losses: r.losses,
  }));

  // Find current user's rank
  let myRank = leaderboard.find((l: typeof leaderboard[number]) => l.id === userId);
  if (!myRank) {
    const myRating = await prisma.pvpRating.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    if (myRating) {
      const rank = await prisma.pvpRating.count({
        where: { rating: { gt: myRating.rating } },
      });
      myRank = {
        rank: rank + 1,
        id: myRating.user.id,
        name: myRating.user.name,
        image: myRating.user.image,
        rating: myRating.rating,
        wins: myRating.wins,
        losses: myRating.losses,
      };
    }
  }

  return NextResponse.json({ leaderboard, myRank });
}
