import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const courses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const body = await req.json();
  const course = await prisma.course.create({
    data: {
      title: body.title,
      description: body.description,
      tags: body.tags || [],
      difficulty: body.difficulty || "beginner",
      estimatedHours: body.estimatedHours || 1,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
