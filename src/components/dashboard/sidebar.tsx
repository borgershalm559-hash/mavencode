"use client";

import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { LogOut, PanelLeftClose, PanelLeftOpen, Flame } from "lucide-react";
import { sections } from "./data";
import type { UserProfile } from "@/types/dashboard";

const GREEN      = "#10B981";
const GREEN_SOFT = "rgba(16,185,129,0.09)";
const GREEN_LINE = "rgba(16,185,129,0.28)";

interface SidebarProps {
  active: string;
  onNavigate: (key: string) => void;
  profile?: UserProfile;
  collapsed: boolean;
  onToggle: () => void;
  coursesCount?: number;
  newsCount?: number;
}

export function Sidebar({
  active, onNavigate, profile, collapsed, onToggle,
  coursesCount, newsCount,
}: SidebarProps) {
  // Dynamic badges from real data; "live" is static for PvP.
  const BADGES: Record<string, string> = {
    ...(typeof coursesCount === "number" && coursesCount > 0 ? { courses: String(coursesCount) } : {}),
    ...(typeof newsCount === "number" && newsCount > 0 ? { news: String(newsCount) } : {}),
    pvp: "live",
  };

  const xpPercent = profile
    ? Math.min((profile.xp / profile.xpForNextLevel) * 100, 100)
    : 0;

  return (
    <aside
      className="h-screen sticky top-0 flex flex-col border-r-2 border-white/10 bg-[#0A0A0B] transition-[width] duration-200 overflow-hidden"
      style={{ width: collapsed ? 60 : 260 }}
    >
      {/* ── Brand ── */}
      <div
        className="border-b-2 border-white/10 flex items-center gap-3 flex-shrink-0"
        style={{ padding: collapsed ? "10px" : "16px", justifyContent: collapsed ? "center" : undefined }}
      >
        <img
          src="/logo.svg"
          alt="MavenCode"
          width={40}
          height={32}
          className="flex-shrink-0"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="font-mono text-[14px] font-black tracking-tight text-white leading-none">
                Maven<span style={{ color: GREEN }}>Code</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35 mt-1">
                Dashboard
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Section label ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-4 pt-4 pb-2 font-mono text-[9px] uppercase tracking-[0.35em] text-white/30 flex-shrink-0"
          >
            Навигация · {sections.length}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ── */}
      <nav
        className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{ padding: collapsed ? "12px 6px 0" : "0 12px" }}
      >
        {sections.map((s) => {
          const isActive = active === s.key;
          const Icon = s.icon;
          const badge = BADGES[s.key];

          return (
            <div key={s.key} className="relative group/nav">
              <button
                onClick={() => onNavigate(s.key)}
                className="w-full text-left flex items-center border-2 transition-all duration-150 overflow-hidden"
                style={{
                  background:   isActive ? GREEN : "transparent",
                  borderColor:  isActive ? GREEN : "rgba(255,255,255,0.08)",
                  boxShadow:    isActive ? `4px 4px 0 0 ${GREEN}55` : "none",
                  color:        isActive ? "#000" : "rgba(255,255,255,0.7)",
                  padding:      collapsed ? "10px 0" : "12px",
                  gap:          collapsed ? 0 : 12,
                  justifyContent: collapsed ? "center" : undefined,
                }}
              >
                {collapsed ? (
                  /* Collapsed: only the icon, centered */
                  <Icon className="size-[18px] flex-shrink-0" />
                ) : (
                  <>
                    {/* Icon */}
                    <Icon className="size-[17px] flex-shrink-0" />

                    {/* Label */}
                    <span className="flex-1 font-mono text-[12px] font-bold uppercase tracking-[0.18em] overflow-hidden whitespace-nowrap">
                      {s.label}
                    </span>

                    {/* Badge */}
                    {badge && (
                      <span
                        className="font-mono text-[9px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 border-2 flex-shrink-0"
                        style={isActive
                          ? { borderColor: "rgba(0,0,0,0.4)", color: "#000" }
                          : { color: GREEN, borderColor: GREEN_LINE, background: GREEN_SOFT }
                        }
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Collapsed tooltip */}
              {collapsed && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 border-2 border-white/[0.07] text-white text-xs font-mono font-bold uppercase tracking-[0.15em] whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 transition-opacity duration-150 z-50"
                  style={{ background: "#0F1011", boxShadow: "3px 3px 0 0 rgba(16,185,129,0.25)" }}
                >
                  {s.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── User + XP ── */}
      <div
        className="border-t-2 border-white/10 flex-shrink-0 overflow-hidden"
        style={{ padding: collapsed ? "8px" : "12px" }}
      >
        <button
          onClick={() => onNavigate("profile")}
          className="w-full flex items-center gap-2.5 border-2 border-white/10 hover:border-white/20 transition-colors duration-150 min-w-0 overflow-hidden"
          style={{
            padding: collapsed ? "4px" : "8px",
            justifyContent: collapsed ? "center" : undefined,
          }}
        >
          {/* Pixel avatar */}
          <div
            className="flex-shrink-0 grid place-items-center overflow-hidden"
            style={{
              width: collapsed ? 32 : 36,
              height: collapsed ? 32 : 36,
              background: GREEN_SOFT,
              border: `2px solid ${GREEN_LINE}`,
            }}
          >
            {profile?.image ? (
              <img src={profile.image} alt="" className="size-full object-cover" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 8 8" shapeRendering="crispEdges">
                <rect x="0" y="0" width="8" height="8" fill={GREEN} />
                <rect x="2" y="2" width="1" height="1" fill="#0A0A0B" />
                <rect x="5" y="2" width="1" height="1" fill="#0A0A0B" />
                <rect x="2" y="5" width="4" height="1" fill="#0A0A0B" />
              </svg>
            )}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <div className="text-white text-[11px] font-semibold truncate font-mono">
                  {profile?.name || "Maven User"}
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-[0.15em]">
                  <span
                    className="px-1.5 py-0.5 border-2"
                    style={{ color: GREEN, borderColor: GREEN_LINE, background: GREEN_SOFT }}
                  >
                    LV.{profile?.level ?? 1}
                  </span>
                  {(profile?.streak ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-white/50">
                      <Flame className="size-2.5" />
                      {profile?.streak}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* XP bar */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-2 px-1"
            >
              <div className="h-1 bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${xpPercent}%`, background: GREEN }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                <span>{profile?.xp ?? 0}/{profile?.xpForNextLevel ?? 1000} XP</span>
                <span>до LV.{(profile?.level ?? 1) + 1}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer actions ── */}
      <div className="border-t-2 border-white/10 divide-y-2 divide-white/[0.05] flex-shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 py-3 text-white/50 hover:text-red-400 hover:bg-red-500/[0.04] font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-colors duration-150"
          style={{ justifyContent: collapsed ? "center" : undefined, padding: collapsed ? "12px 0" : "12px 16px" }}
        >
          <LogOut className="size-[15px] flex-shrink-0" />
          {!collapsed && <span>Выйти</span>}
        </button>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 py-3 text-white/40 hover:text-white/70 hover:bg-white/[0.03] font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-colors duration-150"
          style={{ justifyContent: collapsed ? "center" : undefined, padding: collapsed ? "12px 0" : "12px 16px" }}
        >
          {collapsed
            ? <PanelLeftOpen className="size-[15px] flex-shrink-0" />
            : <PanelLeftClose className="size-[15px] flex-shrink-0" />
          }
          {!collapsed && <span>Свернуть</span>}
        </button>
      </div>
    </aside>
  );
}
