import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const items = await prisma.libraryResource.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const body = await req.json();
  const item = await prisma.libraryResource.create({
    data: {
      title: body.title,
      kind: body.kind,
      size: body.size || "",
      body: body.body,
      url: body.url || null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
