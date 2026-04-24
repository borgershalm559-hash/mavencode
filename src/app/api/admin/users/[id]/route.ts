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
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(body.role !== undefined && { role: body.role }),
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
