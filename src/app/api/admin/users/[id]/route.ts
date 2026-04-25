import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const [adminId, error] = await getAdminUserId();
  if (error) return error;

  const { id } = await params;

  // Prevent admin from demoting themselves
  if (id === adminId) {
    return NextResponse.json({ error: "Cannot modify own role" }, { status: 400 });
  }

  const body = await req.json();
  const ALLOWED_ROLES = ["user", "admin"] as const;
  type AllowedRole = (typeof ALLOWED_ROLES)[number];

  if (body.role !== undefined && !ALLOWED_ROLES.includes(body.role as AllowedRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(body.role !== undefined && { role: body.role as AllowedRole }),
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
