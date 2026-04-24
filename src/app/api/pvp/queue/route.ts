import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  // Find a waiting match that the user isn't already in
  const waitingMatch = await prisma.pvpMatch.findFirst({
    where: {
      status: "waiting",
      player1Id: { not: userId },
      player2Id: null,
    },
    orderBy: { startedAt: "asc" },
  });

  if (waitingMatch) {
    // Join existing match
    const match = await prisma.pvpMatch.update({
      where: { id: waitingMatch.id },
      data: {
        player2Id: userId,
        status: "active",
        startedAt: new Date(),
      },
    });
    return NextResponse.json({ matchId: match.id, status: "active" });
  }

  // Pick a random challenge
  const challenges = await prisma.pvpChallenge.findMany({ select: { id: true } });
  if (challenges.length === 0) {
    return NextResponse.json({ error: "No challenges available" }, { status: 400 });
  }
  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

  // Create new match
  const match = await prisma.pvpMatch.create({
    data: {
      challengeId: randomChallenge.id,
      player1Id: userId,
      status: "waiting",
    },
  });

  // Ensure user has a PvpRating
  await prisma.pvpRating.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  return NextResponse.json({ matchId: match.id, status: "waiting" });
}
