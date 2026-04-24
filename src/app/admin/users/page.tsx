"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Search, Loader2 } from "lucide-react";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  level: number;
  xp: number;
  createdAt: string;
}

interface UsersResponse {
  users: UserRow[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, mutate } = useSWR<UsersResponse>(
    `/api/admin/users?search=${encodeURIComponent(search)}&page=${page}`,
    fetcher
  );

  const toggleRole = async (user: UserRow) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Сменить роль ${user.email} на "${newRole}"?`)) return;
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    mutate();
  };

  return (
    <div>
      <h1 className="text-lg font-bold font-mono uppercase tracking-[0.15em] text-white/90 mb-6">Пользователи</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Поиск по имени или email..."
          className="w-full h-10 pl-10 pr-3 bg-surface border-2 border-white/[0.07] text-sm text-white placeholder:text-white/25 outline-none focus:border-[#10B981]/40 font-mono"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981] animate-spin" /></div>
      ) : (
        <>
          <div className="border-2 border-white/[0.07] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.03] border-b-2 border-white/[0.05]">
                  <th className="px-4 py-3 text-left text-xs text-white/40 font-mono uppercase tracking-[0.15em]">Пользователь</th>
                  <th className="px-4 py-3 text-left text-xs text-white/40 font-mono uppercase tracking-[0.15em]">Email</th>
                  <th className="px-4 py-3 text-left text-xs text-white/40 font-mono uppercase tracking-[0.15em]">Роль</th>
                  <th className="px-4 py-3 text-left text-xs text-white/40 font-mono uppercase tracking-[0.15em]">Уровень</th>
                  <th className="px-4 py-3 text-right text-xs text-white/40 font-mono uppercase tracking-[0.15em]">Действия</th>
                </tr>
              </thead>
              <tbody>
                {(data?.users || []).map((user) => (
                  <tr key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 text-sm text-white/80 font-mono">{user.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-white/55 font-mono">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 border text-xs font-mono ${user.role === "admin" ? "border-[#10B981]/25 bg-[#10B981]/[0.08] text-[#10B981]" : "border-white/[0.05] bg-white/[0.03] text-white/45"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/55 font-mono">Lv.{user.level}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleRole(user)}
                        className="px-2.5 py-1 border border-[#10B981]/20 text-xs font-mono text-[#10B981]/80 hover:text-[#10B981] hover:bg-[#10B981]/[0.06] transition-all"
                      >
                        {user.role === "admin" ? "→ user" : "→ admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
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
