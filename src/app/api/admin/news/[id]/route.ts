import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const item = await prisma.news.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.body !== undefined && { body: body.body }),
      ...(body.summary !== undefined && { summary: body.summary }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.pinned !== undefined && { pinned: body.pinned }),
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  await prisma.news.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
