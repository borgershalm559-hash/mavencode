"use client";

import useSWR from "swr";
import { Zap, BookOpen, Trophy, CheckCircle2 } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import type { RecentActivityItem } from "@/app/api/user/recent-activity/route";

const KIND_META: Record<string, { icon: React.ReactNode; color: string }> = {
  xp:          { icon: <Zap className="size-3.5" />,          color: "#10B981" },
  lesson:      { icon: <CheckCircle2 className="size-3.5" />, color: "#3B82F6" },
  achievement: { icon: <Trophy className="size-3.5" />,        color: "#F97316" },
  course:      { icon: <BookOpen className="size-3.5" />,      color: "#10B981" },
};

export function RecentActivityCard() {
  const { data, isLoading } = useSWR<RecentActivityItem[]>(
    "/api/user/recent-activity",
    fetcher,
    { revalidateOnFocus: false },
  );

  if (isLoading) {
    return (
      <div className="px-5 pb-5 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-white/[0.04] border border-white/[0.05] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="px-5 pb-5 font-mono text-xs text-white/30 uppercase tracking-[0.15em] py-6 text-center">
        Нет недавних событий
      </div>
    );
  }

  return (
    <div className="px-5 pb-5 space-y-1.5">
      {data.map((r, i) => {
        const m = KIND_META[r.kind] ?? KIND_META.lesson;
        return (
          <div key={i} className="flex items-center gap-3 py-1">
            <div
              className="size-7 flex-shrink-0 flex items-center justify-center border border-white/10"
              style={{ color: m.color, background: "rgba(255,255,255,0.02)" }}
            >
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/85 text-[13px] leading-tight truncate">{r.title}</div>
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.1em] mt-0.5 truncate">
                {r.sub}
              </div>
            </div>
            <div className="font-mono text-[10px] text-white/25 uppercase tracking-[0.1em] whitespace-nowrap flex-shrink-0">
              {r.t}
            </div>
          </div>
        );
      })}
    </div>
  );
}
