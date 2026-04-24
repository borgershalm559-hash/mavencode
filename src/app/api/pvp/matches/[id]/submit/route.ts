import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { calculateElo } from "@/lib/pvp-elo";
import { checkAndUnlockAchievements } from "@/lib/gamification";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id } = await params;
  const { code, passed, score, timeSpent } = await req.json();

  const match = await prisma.pvpMatch.findUnique({
    where: { id },
    include: { submissions: true },
  });

  if (!match || match.status === "completed") {
    return NextResponse.json({ error: "Invalid match" }, { status: 400 });
  }

  if (match.player1Id !== userId && match.player2Id !== userId) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  // Check if user already submitted
  const alreadySubmitted = match.submissions.some((s: { userId: string }) => s.userId === userId);
  if (alreadySubmitted) {
    return NextResponse.json({ error: "Already submitted" }, { status: 400 });
  }

  // Create submission
  await prisma.pvpSubmission.create({
    data: {
      userId,
      challengeId: match.challengeId,
      matchId: id,
      code,
      passed: passed ?? false,
      score: score ?? 0,
      timeSpent: timeSpent ?? 0,
    },
  });

  // Check if both players have submitted
  const otherSubmission = match.submissions.find((s: { userId: string }) => s.userId !== userId);

  if (otherSubmission) {
    // Determine winner
    let winnerId: string | null = null;

    if (passed && !otherSubmission.passed) {
      winnerId = userId;
    } else if (!passed && otherSubmission.passed) {
      winnerId = otherSubmission.userId;
    } else if (passed && otherSubmission.passed) {
      // Both passed — faster wins, then higher score
      if (timeSpent < otherSubmission.timeSpent) winnerId = userId;
      else if (timeSpent > otherSubmission.timeSpent) winnerId = otherSubmission.userId;
      else winnerId = (score ?? 0) >= otherSubmission.score ? userId : otherSubmission.userId;
    }
    // If neither passed, no winner (draw)

    // Finalize match
    await prisma.pvpMatch.update({
      where: { id },
      data: { status: "completed", winnerId, endedAt: new Date() },
    });

    // Update ELO if there's a winner
    if (winnerId) {
      const loserId = winnerId === userId ? otherSubmission.userId : userId;

      const [winnerRating, loserRating] = await Promise.all([
        prisma.pvpRating.upsert({
          where: { userId: winnerId },
          create: { userId: winnerId },
          update: {},
        }),
        prisma.pvpRating.upsert({
          where: { userId: loserId },
          create: { userId: loserId },
          update: {},
        }),
      ]);

      const { newWinner, newLoser } = calculateElo(winnerRating.rating, loserRating.rating);

      await Promise.all([
        prisma.pvpRating.update({
          where: { userId: winnerId },
          data: { rating: newWinner, wins: { increment: 1 }, streak: { increment: 1 } },
        }),
        prisma.pvpRating.update({
          where: { userId: loserId },
          data: { rating: newLoser, losses: { increment: 1 }, streak: 0 },
        }),
      ]);

      // Check "Team" achievement for winner
      await checkAndUnlockAchievements(winnerId);
    }

    return NextResponse.json({ status: "completed", winnerId });
  }

  return NextResponse.json({ status: "waiting_for_opponent" });
}
