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
  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
      ...(body.estimatedHours !== undefined && { estimatedHours: body.estimatedHours }),
      ...(body.isPublished !== undefined && { isPublished: !!body.isPublished }),
      ...(body.image !== undefined && { image: body.image || null }),
      ...(body.iconText !== undefined && { iconText: body.iconText || null }),
      ...(body.color !== undefined && { color: body.color || null }),
    },
  });

  return NextResponse.json(course);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
