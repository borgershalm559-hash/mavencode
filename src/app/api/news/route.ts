import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const news = await prisma.news.findMany({
    where: category ? { category } : undefined,
    orderBy: { publishedAt: "desc" },
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
