import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

export async function GET(req: Request) {
  const [, error] = await getAuthUserId();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const rawLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(1, rawLimit), MAX_LIMIT) : DEFAULT_LIMIT;

  const resources = await prisma.libraryResource.findMany({
    where: kind ? { kind } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(
    resources.map((r) => ({
      id: r.id,
      title: r.title,
      kind: r.kind,
      size: r.size,
      body: r.body,
      url: r.url,
    }))
  );
}
