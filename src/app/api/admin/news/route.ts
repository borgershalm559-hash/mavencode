import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(news);
}

export async function POST(req: Request) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const body = await req.json();
  const item = await prisma.news.create({
    data: {
      title: body.title,
      category: body.category,
      body: body.body,
      summary: body.summary || null,
      imageUrl: body.imageUrl || null,
      pinned: body.pinned || false,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
