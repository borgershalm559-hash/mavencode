import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [, error] = await getAuthUserId();
  if (error) return error;

  const challenges = await prisma.pvpChallenge.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, description: true, language: true, difficulty: true, timeLimit: true, tests: true, starterCode: true },
  });

  return NextResponse.json(challenges);
}
