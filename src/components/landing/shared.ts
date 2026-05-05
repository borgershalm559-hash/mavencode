// Color tokens used across all landing components — keep in sync with /login.
export const G = "#10B981";
export const GL = "rgba(16,185,129,0.28)";

// Standard motion ease used throughout the dashboard and /login.
export const EASE = [0.22, 1, 0.36, 1] as const;

// Public stats payload shape — mirrors the API response.
export interface PublicStats {
  students: number;
  solvedToday: number;
  coursesCount: number;
}

// Public course payload shape.
export interface PublicCourse {
  id: string;
  title: string;
  description: string;
  iconText: string | null;
  color: string | null;
  difficulty: string;
  tags: string[];
  lessonCount: number;
}

export function formatNum(n: number): string {
  return n.toLocaleString("ru-RU");
}
