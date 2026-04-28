"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { fetcher } from "@/lib/fetcher";
import { Search, Loader2, ShieldCheck, ChevronRight, Flame } from "lucide-react";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  level: number;
  xp: number;
  streak: number;
  createdAt: string;
  agreedToTermsAt: string | null;
  completedLessons: number;
}

interface UsersResponse {
  users: UserRow[];
  total: number;
  page: number;
  totalPages: number;
}

const ROLE_FILTERS = [
  { key: "all", label: "Все" },
  { key: "user", label: "Студенты" },
  { key: "admin", label: "Админы" },
] as const;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSWR<UsersResponse>(
    `/api/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}&page=${page}`,
    fetcher
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90">Пользователи</h1>
        <p className="text-[12px] text-white/40 font-mono mt-1">{data?.total ?? 0} аккаунтов</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Поиск по имени или email..."
            className="w-full h-10 pl-10 pr-3 bg-[#0B0B0C] border-2 border-white/[0.08] text-sm text-white placeholder:text-white/25 outline-none focus:border-[#10B981]/40 font-mono"
          />
        </div>
        <div className="flex gap-2">
          {ROLE_FILTERS.map((f) => {
            const active = roleFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => { setRoleFilter(f.key); setPage(1); }}
                className="font-mono text-[11px] px-3 py-1.5"
                style={{
                  border: `2px solid ${active ? "#10B981" : "rgba(255,255,255,0.08)"}`,
                  background: active ? "rgba(16,185,129,0.1)" : "transparent",
                  color: active ? "#10B981" : "rgba(255,255,255,0.55)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  height: 40,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981] animate-spin" /></div>
      ) : (
        <>
          <div className="border-2 border-white/[0.07] bg-[#0F1011]">
            {(data?.users || []).length === 0 ? (
              <div className="p-10 text-center font-mono text-[12px] text-white/40">Никого не нашли</div>
            ) : (
              (data?.users || []).map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-3 px-4 py-3 border-b-2 border-white/[0.05] last:border-b-0 hover:bg-white/[0.02] group"
                >
                  <div className="w-9 h-9 border-2 border-white/[0.08] bg-[#0B0B0C] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.image ? (
                      <Image src={user.image} alt="" width={36} height={36} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[14px] font-mono text-white/55">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] text-white truncate">{user.name || "—"}</span>
                      {user.role === "admin" && (
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[#10B981]" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
                          <ShieldCheck size={10} /> Админ
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-white/45 truncate font-mono">{user.email}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-[11px] font-mono">
                    <span className="text-white/55">Lv.{user.level}</span>
                    <span className="text-white/45">{user.xp} XP</span>
                    {user.streak > 0 && (
                      <span className="text-orange-400/80 inline-flex items-center gap-1">
                        <Flame size={11} /> {user.streak}
                      </span>
                    )}
                    <span className="text-white/35 w-20 text-right">{user.completedLessons} уроков</span>
                  </div>
                  <ChevronRight size={16} className="text-white/30 group-hover:text-[#10B981]" />
                </Link>
              ))
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 border-2 text-xs font-mono transition-all ${
                    page === i + 1 ? "border-[#10B981]/30 bg-[#10B981]/[0.08] text-[#10B981]" : "border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
