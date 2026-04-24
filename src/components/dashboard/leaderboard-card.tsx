"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { LeaderboardData } from "@/types/dashboard";

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

interface LeaderboardCardProps {
  currentUserId: string;
  compact?: boolean;
}

export function LeaderboardCard({ currentUserId, compact = false }: LeaderboardCardProps) {
  const { data, isLoading } = useSWR<LeaderboardData>("/api/leaderboard", fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div className={`space-y-1.5 ${compact ? "px-0 pb-2" : "px-5 pb-5"}`}>
        {Array.from({ length: compact ? 6 : 5 }).map((_, i) => (
          <div key={i} className={`bg-white/[0.04] border border-white/[0.05] animate-pulse ${compact ? "h-10" : "h-12 border-2 border-white/[0.07]"}`} />
        ))}
      </div>
    );
  }

  if (!data?.users.length) {
    return (
      <div className={`font-mono text-xs text-white/30 uppercase tracking-[0.15em] ${compact ? "px-4 pb-3" : "px-5 pb-5"}`}>
        Нет данных рейтинга
      </div>
    );
  }

  const topXp = data.users[0]?.xp || 1;

  // ── Compact mode (V1 style: divide-y list, no XP bar) ──────────────────────
  if (compact) {
    return (
      <div className="divide-y divide-white/[0.05] pb-2">
        {data.users.slice(0, 7).map((user) => {
          const isMe = user.id === currentUserId;
          return (
            <div
              key={user.id}
              className="flex items-center gap-2.5 px-4 py-2"
              style={isMe ? { borderLeft: "3px solid #10B981", marginLeft: -3, paddingLeft: 13, background: "rgba(16,185,129,0.025)" } : {}}
            >
              <div className="font-mono text-[11px] w-5 tabular-nums font-bold flex-shrink-0"
                   style={{ color: isMe ? "#10B981" : "rgba(255,255,255,0.35)" }}>
                #{user.rank}
              </div>
              <div className="size-6 flex-shrink-0 flex items-center justify-center border border-white/10 bg-white/[0.03] text-[9px] font-bold text-white/60">
                {getInitials(user.name)}
              </div>
              <div className={`flex-1 text-[12px] truncate ${isMe ? "text-white font-semibold" : "text-white/60"}`}>
                {user.name || "Аноним"}
                {isMe && <span className="font-mono text-[8px] uppercase tracking-[0.2em] ml-1.5" style={{ color: "#10B981" }}>Вы</span>}
              </div>
              <div className="font-mono text-[9px] text-white/25 uppercase tracking-[0.1em] flex-shrink-0 hidden xl:block">
                Lv.{user.level}
              </div>
              <div className="font-mono text-[10px] tabular-nums font-semibold flex-shrink-0"
                   style={{ color: isMe ? "#10B981" : "rgba(255,255,255,0.35)" }}>
                {user.xp.toLocaleString("ru-RU")}
              </div>
            </div>
          );
        })}
        {data.currentUserRank > 7 && (
          <div className="px-4 py-2 flex items-center gap-2">
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.1em] flex-1">Ваше место</div>
            <div className="font-mono text-xs font-bold text-[#10B981]">#{data.currentUserRank}</div>
          </div>
        )}
      </div>
    );
  }

  // ── Full mode ───────────────────────────────────────────────────────────────
  return (
    <div className="px-5 pb-5">
      {data.totalCount > 0 && (
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3">
          Топ {data.users.length} из {data.totalCount} участников
        </p>
      )}

      <div className="space-y-1.5">
        {data.users.slice(0, 10).map((user) => {
          const isMe = user.id === currentUserId;
          const xpPercent = Math.round((user.xp / topXp) * 100);

          return (
            <div
              key={user.id}
              className={`border-2 px-4 py-2.5 transition-all duration-200 ${
                isMe
                  ? "bg-[#10B981]/[0.08] border-[#10B981]/50"
                  : "bg-surface border-white/[0.07] hover:border-white/[0.15]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 flex-shrink-0 text-center">
                  {RANK_MEDAL[user.rank] ? (
                    <span className="text-base leading-none">{RANK_MEDAL[user.rank]}</span>
                  ) : (
                    <span className={`font-mono text-xs font-bold ${isMe ? "text-[#10B981]" : "text-white/30"}`}>
                      {user.rank}
                    </span>
                  )}
                </div>

                <div className={`size-8 flex-shrink-0 overflow-hidden flex items-center justify-center border-2 ${
                  isMe ? "border-[#10B981]/50 bg-[#10B981]/[0.08]" : "border-white/[0.07] bg-white/[0.03]"
                }`}>
                  {user.image ? (
                    <img src={user.image} alt="" className="size-8 object-cover" />
                  ) : (
                    <span className={`font-mono text-[10px] font-bold ${isMe ? "text-[#10B981]/80" : "text-white/40"}`}>
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate font-medium ${isMe ? "text-[#10B981]" : "text-white/70"}`}>
                      {user.name || "Аноним"}
                    </span>
                    {isMe && (
                      <span className="flex-shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                        вы
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isMe ? "bg-gradient-to-r from-[#10B981] to-[#047857]" : "bg-white/[0.20]"
                        }`}
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`font-mono text-xs font-semibold tabular-nums ${isMe ? "text-[#10B981]" : "text-white/40"}`}>
                    {user.xp} XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data.currentUserRank > 10 && (
        <div className="mt-4 pt-3 border-t-2 border-white/[0.07] flex items-center justify-center gap-2">
          <span className="font-mono text-xs text-white/30 uppercase tracking-[0.15em]">Ваше место</span>
          <span className="font-mono text-sm font-bold text-[#10B981]">#{data.currentUserRank}</span>
          <span className="font-mono text-xs text-white/20">из {data.totalCount}</span>
        </div>
      )}
    </div>
  );
}
