import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

export async function GET(req: Request) {
  const [, error] = await getAuthUserId();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const rawLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(1, rawLimit), MAX_LIMIT) : DEFAULT_LIMIT;

  const news = await prisma.news.findMany({
    where: category ? { category } : undefined,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(
    news.map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      body: n.body,
      summary: n.summary || n.body.slice(0, 120) + (n.body.length > 120 ? "..." : ""),
      imageUrl: n.imageUrl,
      pinned: n.pinned,
      date: n.publishedAt.toISOString().slice(0, 10),
    }))
  );
}
