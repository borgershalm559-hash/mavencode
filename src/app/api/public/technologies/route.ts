import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public, unauthenticated list of technologies for which at least one
 * published course exists.
 *
 * Source of truth: the `tags` field on Course. We map known technology
 * tags to display names so admins can use either Cyrillic/English forms
 * (e.g. "HTML" or "html") without breaking the landing.
 *
 * Tag rows that don't match any registered technology (e.g. "Веб",
 * "Основы", "С нуля") are intentionally ignored — they are categories,
 * not technologies.
 */

const TECH_REGISTRY = [
  { name: "Python",     matchTags: ["Python", "python", "PYTHON"] },
  { name: "JavaScript", matchTags: ["JavaScript", "JS", "javascript", "js"] },
  { name: "TypeScript", matchTags: ["TypeScript", "TS", "typescript", "ts"] },
  { name: "Go",         matchTags: ["Go", "Golang", "go"] },
  { name: "SQL",        matchTags: ["SQL", "sql", "Postgres", "PostgreSQL", "MySQL"] },
  { name: "HTML",       matchTags: ["HTML", "html"] },
  { name: "CSS",        matchTags: ["CSS", "css"] },
  { name: "React",      matchTags: ["React", "react", "REACT"] },
  { name: "Next.js",    matchTags: ["Next.js", "NEXT", "nextjs"] },
  { name: "Docker",     matchTags: ["Docker", "docker"] },
  { name: "Git",        matchTags: ["Git", "git"] },
  { name: "Linux",      matchTags: ["Linux", "linux"] },
  { name: "Rust",       matchTags: ["Rust", "rust"] },
  { name: "Алгоритмы",  matchTags: ["Алгоритмы", "Algorithms", "algorithms"] },
];

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      select: { tags: true },
    });

    const allTags = new Set<string>();
    for (const c of courses) for (const t of c.tags) allTags.add(t);

    const names = TECH_REGISTRY
      .filter((t) => t.matchTags.some((m) => allTags.has(m)))
      .map((t) => t.name);

    return NextResponse.json(names, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
