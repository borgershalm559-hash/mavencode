"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Swords, Trophy, Flame, TrendingDown, Loader2 } from "lucide-react";

interface PvpStats {
  rating: number;
  wins: number;
  losses: number;
  streak: number;
  matches: {
    id: string;
    challenge: string;
    opponent: string;
    result: string;
    date: string | null;
  }[];
}

interface PvpLeaderboard {
  leaderboard: {
    rank: number;
    id: string;
    name: string | null;
    rating: number;
    wins: number;
    losses: number;
  }[];
  myRank: { rank: number; rating: number } | null;
}

export function PvpSection() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useSWR<PvpStats>("/api/pvp/stats", fetcher, { revalidateOnFocus: false });
  const { data: lb, isLoading: lbLoading } = useSWR<PvpLeaderboard>("/api/pvp/leaderboard", fetcher, { revalidateOnFocus: false });
  const [finding, setFinding] = useState(false);

  const findMatch = async () => {
    setFinding(true);
    try {
      const res = await fetch("/api/pvp/queue", { method: "POST" });
      const data = await res.json();
      if (data.matchId) {
        router.push(`/pvp/${data.matchId}`);
      }
    } catch (e) {
      console.error("[PVP Queue Error]", e);
    } finally {
      setFinding(false);
    }
  };

  const statCards = [
    { title: "Рейтинг", value: stats?.rating ?? 1000, icon: Trophy },
    { title: "Побед", value: stats?.wins ?? 0, icon: Swords },
    { title: "Поражений", value: stats?.losses ?? 0, icon: TrendingDown },
    { title: "Серия", value: `W${stats?.streak ?? 0}`, icon: Flame },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="bg-surface border-2 border-[#10B981]/20 px-4 py-3"
              style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="size-8 bg-[#10B981]/[0.08] border border-[#10B981]/15 flex items-center justify-center">
                  <Icon className="size-4 text-[#10B981]/70" />
                </div>
                <div>
                  <div className="text-white text-base font-bold leading-none">{s.value}</div>
                  <div className="font-mono text-white/30 text-xs uppercase tracking-[0.2em] mt-1">{s.title}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Find Match */}
      <button
        onClick={findMatch}
        disabled={finding}
        className="w-full flex items-center justify-center gap-2 h-12 text-sm font-semibold font-mono uppercase tracking-[0.15em]
          bg-gradient-to-r from-[#10B981] to-[#047857] text-black border-2 border-black
          disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={{ boxShadow: finding ? "none" : "4px 4px 0 0 #000" }}
      >
        {finding ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Swords className="w-4 h-4" />
        )}
        {finding ? "Поиск матча..." : "Найти матч"}
      </button>

      {/* PVP Leaderboard */}
      {!lbLoading && lb && lb.leaderboard.length > 0 && (
        <div className="bg-surface border-2 border-[#10B981]/20 overflow-hidden" style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
          <div className="px-4 py-3 border-b-2 border-white/[0.07]">
            <div className="font-mono text-white/40 text-xs uppercase tracking-[0.2em]">PVP Рейтинг</div>
          </div>
          {lb.leaderboard.slice(0, 10).map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-4 px-4 py-2.5 text-sm border-b border-white/[0.06] last:border-b-0"
            >
              <div className="font-mono text-white/40">#{p.rank}</div>
              <div className="text-white/80">{p.name || "—"}</div>
              <div className="font-mono text-[#10B981] font-medium">{p.rating}</div>
              <div className="font-mono text-white/30">{p.wins}W / {p.losses}L</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Matches */}
      {!statsLoading && stats && stats.matches.length > 0 && (
        <div className="bg-surface border-2 border-[#10B981]/20 p-4" style={{ boxShadow: "4px 4px 0 0 rgba(16,185,129,0.55)" }}>
          <div className="font-mono text-white/40 text-xs uppercase tracking-[0.2em] mb-3">Недавние матчи</div>
          <div className="space-y-2">
            {stats.matches.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-2 border-white/[0.07] px-4 py-3">
                <div>
                  <div className="text-white/80 text-sm">vs {m.opponent}</div>
                  <div className="font-mono text-white/30 text-xs mt-0.5">{m.challenge}</div>
                </div>
                <span className={`font-mono text-xs font-bold uppercase tracking-[0.1em] px-2 py-1 border-2 ${
                  m.result === "Победа"
                    ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-600"
                    : m.result === "Поражение"
                    ? "bg-red-400/10 border-red-400/30 text-red-600"
                    : "bg-white/[0.04] border-white/[0.05] text-white/40"
                }`}>
                  {m.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!statsLoading && stats && stats.matches.length === 0 && (
        <div className="text-center py-8 font-mono text-white/25 text-sm uppercase tracking-[0.15em]">
          Ещё нет матчей. Нажмите «Найти матч» чтобы начать!
        </div>
      )}
    </div>
  );
}
