import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function getAuthUserId(): Promise<
  [string, null] | [null, NextResponse]
> {
  const session = await auth();
  if (!session?.user?.id) {
    return [null, NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
  }
  return [session.user.id, null];
}

export async function getAdminUserId(): Promise<
  [string, null] | [null, NextResponse]
> {
  const session = await auth();
  if (!session?.user?.id) {
    return [null, NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
  }
  if (session.user.role !== "admin") {
    return [null, NextResponse.json({ error: "Forbidden" }, { status: 403 })];
  }
  return [session.user.id, null];
}
