"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Users, GraduationCap, BookOpen, Newspaper, Loader2 } from "lucide-react";

interface Stats {
  users: number;
  courses: number;
  lessons: number;
  news: number;
}

export default function AdminPage() {
  const { data, isLoading } = useSWR<Stats>("/api/admin/stats", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Пользователи", value: data?.users ?? 0, icon: Users },
    { label: "Курсы", value: data?.courses ?? 0, icon: GraduationCap },
    { label: "Уроки", value: data?.lessons ?? 0, icon: BookOpen },
    { label: "Новости", value: data?.news ?? 0, icon: Newspaper },
  ];

  return (
    <div>
      <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90 mb-6">Панель администратора</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-surface border-2 border-[#10B981]/20 px-5 py-4"
              style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.4)" }}
            >
              <div className="flex items-center gap-3">
                <div className="size-10 border-2 border-[#10B981]/20 bg-[#10B981]/[0.08] flex items-center justify-center">
                  <Icon className="size-5 text-[#10B981]/70" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white/90">{s.value}</div>
                  <div className="text-xs text-white/30 font-mono uppercase tracking-[0.15em]">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
