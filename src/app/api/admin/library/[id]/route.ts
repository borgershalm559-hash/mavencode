import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  const item = await prisma.libraryResource.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const item = await prisma.libraryResource.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.kind !== undefined && { kind: body.kind }),
      ...(body.size !== undefined && { size: body.size }),
      ...(body.body !== undefined && { body: body.body }),
      ...(body.url !== undefined && { url: body.url }),
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
  await prisma.libraryResource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
