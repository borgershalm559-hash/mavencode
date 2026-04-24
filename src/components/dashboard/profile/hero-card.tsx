"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Flame, Pencil, X, Check, Loader2, Upload } from "lucide-react";
import { GlassCard } from "../glass-card";
import type { UserProfile } from "@/types/dashboard";

interface HeroCardProps {
  profile: UserProfile;
  onProfileUpdate?: (data: { name: string; image: string | null }) => void;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

function formatJoinDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

export function HeroCard({ profile, onProfileUpdate }: HeroCardProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const xpPercent = Math.min((profile.xp / profile.xpForNextLevel) * 100, 100);
  const xpLeft = profile.xpForNextLevel - profile.xp;
  const currentAvatar = avatarPreview ?? profile.image;

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus();
  }, [editingName]);

  const startEditName = () => { setNameValue(profile.name || ""); setNameError(""); setEditingName(true); };
  const cancelName = () => { setEditingName(false); setNameError(""); };

  const saveName = useCallback(async () => {
    const trimmed = nameValue.trim();
    if (trimmed.length < 2) { setNameError("Минимум 2 символа"); return; }
    setNameSaving(true);
    setNameError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) { const d = await res.json(); setNameError(d.error || "Ошибка"); return; }
      const d = await res.json();
      onProfileUpdate?.({ name: d.name, image: d.image ?? profile.image });
      setEditingName(false);
    } catch { setNameError("Произошла ошибка"); }
    finally { setNameSaving(false); }
  }, [nameValue, profile.image, onProfileUpdate]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setAvatarUploading(true);
    setAvatarError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/user/avatar", { method: "POST", body: form });
      if (!res.ok) { const d = await res.json(); setAvatarError(d.error || "Ошибка загрузки"); setAvatarPreview(null); return; }
      const d = await res.json();
      setAvatarPreview(null);
      onProfileUpdate?.({ name: profile.name ?? "", image: d.image });
    } catch { setAvatarError("Произошла ошибка"); setAvatarPreview(null); }
    finally { setAvatarUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  }, [profile.name, onProfileUpdate]);

  return (
    <GlassCard>
      <div
        className="px-6 py-5 grid grid-cols-12 gap-6 items-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* ── Identity (col 4) ── */}
        <div className="col-span-12 md:col-span-4 flex items-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              title="Загрузить фото"
              className="relative group/av size-20 flex items-center justify-center overflow-hidden border-2 border-white/10 bg-[#10B981]/[0.08] disabled:opacity-60"
              style={{ boxShadow: "inset 0 0 0 2px rgba(16,185,129,0.24)" }}
            >
              {currentAvatar ? (
                <img src={currentAvatar} alt="" className="size-20 object-cover" />
              ) : (
                <span className="text-[#10B981] text-2xl font-black select-none">
                  {getInitials(profile.name)}
                </span>
              )}
              {/* Level badge */}
              <div className="absolute bottom-0 right-0 px-1.5 py-0.5 bg-surface border-2 border-white/10 font-mono text-[9px] font-bold text-[#10B981] leading-none">
                LV.{profile.level}
              </div>
              <span className="absolute inset-0 bg-black/60 opacity-0 group-hover/av:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                {avatarUploading
                  ? <Loader2 className="size-5 text-white animate-spin" />
                  : <><Upload className="size-4 text-white/90" /><span className="text-[9px] text-white/70 font-mono uppercase tracking-wider">фото</span></>
                }
              </span>
            </button>
            {avatarError && (
              <p className="mt-1 text-[10px] text-red-400 max-w-[80px] leading-tight text-center">{avatarError}</p>
            )}
          </div>

          {/* Name / email / skills */}
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="relative">
                  <input
                    ref={nameInputRef}
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelName(); }}
                    size={Math.max(nameValue.length, 6)}
                    className="h-8 min-w-[80px] max-w-[200px] bg-surface border-2 border-white/10 focus:border-[#10B981]/65 text-white/90 text-lg font-bold px-2 outline-none transition-colors"
                  />
                  {nameError && (
                    <p className="absolute top-full left-0 mt-1 text-[10px] text-red-400 whitespace-nowrap">{nameError}</p>
                  )}
                </div>
                <button onClick={saveName} disabled={nameSaving} title="Сохранить (Enter)"
                  className="size-7 flex items-center justify-center bg-[#10B981]/15 border-2 border-[#10B981]/25 text-[#10B981] hover:bg-[#10B981]/25 transition-colors disabled:opacity-50">
                  {nameSaving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                </button>
                <button onClick={cancelName} disabled={nameSaving} title="Отмена (Esc)"
                  className="size-7 flex items-center justify-center bg-white/[0.03] border-2 border-white/[0.07] text-white/40 hover:text-white/70 transition-colors">
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={startEditName}
                title="Нажмите чтобы изменить имя"
                className="flex items-center gap-1.5 hover:bg-white/[0.03] -mx-1 px-1 py-0.5 mb-1 transition-colors group/namebtn text-left"
              >
                <span className="text-white text-[22px] font-bold tracking-tight leading-none">
                  {profile.name || "Maven User"}
                </span>
                <Pencil className="size-3 text-white/0 group-hover/namebtn:text-white/30 transition-colors flex-shrink-0" />
              </button>
            )}
            <div className="text-white/35 text-[13px]">{profile.email}</div>
            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.skills.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] border bg-[#10B981]/[0.06]"
                    style={{ color: "rgba(16,185,129,0.7)", borderColor: "rgba(16,185,129,0.24)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── XP Bar (col 5) ── */}
        <div className="col-span-12 md:col-span-5 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                Прогресс уровня
              </span>
              <span className="font-mono text-[10px] text-white/25">до Lv.{profile.level + 1}</span>
            </div>
            <div className="font-mono text-[11px] tabular-nums">
              <span className="font-bold text-[#10B981]">{profile.xp.toLocaleString("ru-RU")}</span>
              <span className="text-white/25"> / {profile.xpForNextLevel.toLocaleString("ru-RU")} XP</span>
            </div>
          </div>

          {/* Bar with tick marks */}
          <div className="relative h-6 bg-white/[0.04] border-2 border-white/[0.06] overflow-hidden">
            {/* Ticks */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-1 border-r border-white/[0.05]" />
              ))}
            </div>
            {/* Fill */}
            <div
              className="h-full relative transition-all duration-700"
              style={{
                width: `${xpPercent}%`,
                background: "linear-gradient(90deg, #10B981, #047857)",
                boxShadow: "inset 0 -2px 0 rgba(4,120,87,0.5)",
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/40" />
            </div>
          </div>

          <div className="flex justify-between font-mono text-[9px] text-white/20 tabular-nums uppercase tracking-[0.15em]">
            <span>{Math.round(xpPercent)}%</span>
            <span>{xpLeft.toLocaleString("ru-RU")} XP осталось</span>
          </div>
        </div>

        {/* ── Streak + join (col 3) ── */}
        <div className="col-span-12 md:col-span-3 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-2 border-2 border-white/[0.08] bg-white/[0.02]">
            <Flame className="size-[18px] text-orange-400" />
            <div>
              <div className="text-white text-xl font-bold tabular-nums leading-none">{profile.streak}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mt-0.5">дней подряд</div>
            </div>
          </div>
          <div className="font-mono text-[10px] text-white/25 uppercase tracking-[0.15em]">
            С нами с {formatJoinDate(profile.createdAt)}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
