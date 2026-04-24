import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [, error] = await getAdminUserId();
  if (error) return error;

  const [users, courses, lessons, news] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.news.count(),
  ]);

  return NextResponse.json({ users, courses, lessons, news });
}
