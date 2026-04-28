import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 20;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(role && role !== "all" && { role }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        level: true,
        xp: true,
        streak: true,
        createdAt: true,
        agreedToTermsAt: true,
        _count: {
          select: { progress: { where: { completed: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role,
      level: u.level,
      xp: u.xp,
      streak: u.streak,
      createdAt: u.createdAt,
      agreedToTermsAt: u.agreedToTermsAt,
      completedLessons: u._count.progress,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
