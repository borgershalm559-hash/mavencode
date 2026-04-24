export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  level: number;
  xp: number;
  xpForNextLevel: number;
  streak: number;
  skills: string[];
  createdAt: string;
  coursesCount: number;
  achievementsCount: number;
  overallProgress: number;
  currentCourses: { title: string; progress: number; completed: number; total: number }[];
  achievements: Achievement[];
  activity: Record<string, number>;
  skillRadar: { skill: string; value: number }[];
}

export interface LeaderboardUser {
  id: string;
  name: string | null;
  image: string | null;
  level: number;
  xp: number;
  rank: number;
}

export interface LeaderboardData {
  users: LeaderboardUser[];
  currentUserRank: number;
  totalCount: number;
}

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  lessonsCount: number;
  progress: number;
  difficulty: string;
  estimatedHours: number;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  progress: number;
  lessons: {
    id: string;
    title: string;
    order: number;
    completed: boolean;
    type: string;
    language: string;
    isAvailable: boolean;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  body: string;
  summary: string;
  imageUrl: string | null;
  pinned: boolean;
  date: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  kind: string;
  size: string;
  body: string;
  url: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
