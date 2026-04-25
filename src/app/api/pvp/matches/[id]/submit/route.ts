import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { calculateElo } from "@/lib/pvp-elo";
import { checkAndUnlockAchievements } from "@/lib/gamification";

interface ResolvedMatch {
  status: "completed" | "waiting_for_opponent";
  winnerId: string | null;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  const code = typeof body.code === "string" ? body.code : "";
  const passed = body.passed === true;
  const score = Number.isFinite(Number(body.score))
    ? Math.max(0, Math.min(10000, Math.floor(Number(body.score))))
    : 0;
  const timeSpent = Number.isFinite(Number(body.timeSpent))
    ? Math.max(0, Math.floor(Number(body.timeSpent)))
    : 0;

  // Wrap submission creation, double-submit guard, and match resolution
  // in a single transaction so two concurrent calls can't both trigger
  // resolution and double-update ELO.
  const resolution = await prisma.$transaction<ResolvedMatch>(async (tx) => {
    const match = await tx.pvpMatch.findUnique({
      where: { id },
      include: { submissions: true },
    });

    if (!match || match.status === "completed") {
      throw new Error("INVALID_MATCH");
    }

    if (match.player1Id !== userId && match.player2Id !== userId) {
      throw new Error("NOT_PARTICIPANT");
    }

    if (match.submissions.some((s) => s.userId === userId)) {
      throw new Error("ALREADY_SUBMITTED");
    }

    await tx.pvpSubmission.create({
      data: {
        userId,
        challengeId: match.challengeId,
        matchId: id,
        code,
        passed,
        score,
        timeSpent,
      },
    });

    const otherSubmission = match.submissions.find((s) => s.userId !== userId);
    if (!otherSubmission) {
      return { status: "waiting_for_opponent", winnerId: null };
    }

    let winnerId: string | null = null;
    if (passed && !otherSubmission.passed) {
      winnerId = userId;
    } else if (!passed && otherSubmission.passed) {
      winnerId = otherSubmission.userId;
    } else if (passed && otherSubmission.passed) {
      if (timeSpent < otherSubmission.timeSpent) winnerId = userId;
      else if (timeSpent > otherSubmission.timeSpent) winnerId = otherSubmission.userId;
      else winnerId = score >= otherSubmission.score ? userId : otherSubmission.userId;
    }

    await tx.pvpMatch.update({
      where: { id },
      data: { status: "completed", winnerId, endedAt: new Date() },
    });

    if (winnerId) {
      const loserId = winnerId === userId ? otherSubmission.userId : userId;

      const [winnerRating, loserRating] = await Promise.all([
        tx.pvpRating.upsert({
          where: { userId: winnerId },
          create: { userId: winnerId },
          update: {},
        }),
        tx.pvpRating.upsert({
          where: { userId: loserId },
          create: { userId: loserId },
          update: {},
        }),
      ]);

      const { newWinner, newLoser } = calculateElo(winnerRating.rating, loserRating.rating);

      await Promise.all([
        tx.pvpRating.update({
          where: { userId: winnerId },
          data: { rating: newWinner, wins: { increment: 1 }, streak: { increment: 1 } },
        }),
        tx.pvpRating.update({
          where: { userId: loserId },
          data: { rating: newLoser, losses: { increment: 1 }, streak: 0 },
        }),
      ]);
    }

    return { status: "completed", winnerId };
  }).catch((e: Error) => {
    if (e.message === "INVALID_MATCH") {
      return NextResponse.json({ error: "Invalid match" }, { status: 400 });
    }
    if (e.message === "NOT_PARTICIPANT") {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }
    if (e.message === "ALREADY_SUBMITTED") {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 });
    }
    throw e;
  });

  if (resolution instanceof NextResponse) return resolution;

  // Achievements after the transaction commits.
  if (resolution.status === "completed" && resolution.winnerId) {
    await checkAndUnlockAchievements(resolution.winnerId);
  }

  return NextResponse.json(resolution);
}
