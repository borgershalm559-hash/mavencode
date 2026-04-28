import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["user", "admin"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      level: true,
      xp: true,
      streak: true,
      location: true,
      skills: true,
      agreedToTermsAt: true,
      agreedTermsVersion: true,
      agreedFromIp: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          progress: true,
          activityLogs: true,
          achievements: true,
        },
      },
      progress: {
        where: { completed: true },
        select: {
          completed: true,
          score: true,
          lesson: {
            select: {
              id: true,
              title: true,
              course: { select: { id: true, title: true } },
            },
          },
        },
        take: 50,
        orderBy: { id: "desc" },
      },
      activityLogs: {
        select: { type: true, count: true, date: true },
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const completedLessons = user.progress.length;
  return NextResponse.json({ ...user, completedLessons });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [adminId, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;

  if (id === adminId) {
    return NextResponse.json({ error: "Cannot modify own role" }, { status: 400 });
  }

  const body = await req.json();

  if (body.role !== undefined && !ALLOWED_ROLES.includes(body.role as AllowedRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (body.level !== undefined && (typeof body.level !== "number" || body.level < 1 || body.level > 999)) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  if (body.xp !== undefined && (typeof body.xp !== "number" || body.xp < 0)) {
    return NextResponse.json({ error: "Invalid xp" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(body.role !== undefined && { role: body.role as AllowedRole }),
      ...(body.level !== undefined && { level: body.level }),
      ...(body.xp !== undefined && { xp: body.xp }),
      ...(body.streak !== undefined && { streak: body.streak }),
    },
    select: { id: true, name: true, email: true, role: true, level: true, xp: true, streak: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [adminId, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;

  if (id === adminId) {
    return NextResponse.json({ error: "Cannot delete own account" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
