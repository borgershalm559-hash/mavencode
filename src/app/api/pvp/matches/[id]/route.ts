import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [userId, error] = await getAuthUserId();
  if (error) return error;

  const { id } = await params;
  const match = await prisma.pvpMatch.findUnique({
    where: { id },
    include: {
      challenge: {
        select: { id: true, title: true, description: true, starterCode: true, language: true, timeLimit: true, tests: true },
      },
      player1: { select: { id: true, name: true } },
      player2: { select: { id: true, name: true } },
      submissions: {
        select: { userId: true, passed: true, timeSpent: true, score: true },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Check user is a participant
  if (match.player1.id !== userId && match.player2?.id !== userId) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  const opponent = match.player1.id === userId ? match.player2 : match.player1;
  const mySubmission = match.submissions.find((s: { userId: string }) => s.userId === userId);
  const opponentSubmitted = match.submissions.some((s: { userId: string }) => s.userId !== userId);

  return NextResponse.json({
    id: match.id,
    status: match.status,
    challenge: match.challenge,
    opponent: opponent ? { id: opponent.id, name: opponent.name } : null,
    mySubmission: mySubmission || null,
    opponentSubmitted,
    winnerId: match.winnerId,
    startedAt: match.startedAt,
    endedAt: match.endedAt,
  });
}
