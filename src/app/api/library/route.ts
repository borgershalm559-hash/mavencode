import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");

  const resources = await prisma.libraryResource.findMany({
    where: kind ? { kind } : undefined,
    orderBy: { createdAt: "desc" },
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
