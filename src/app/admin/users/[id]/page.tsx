"use client";

import { use, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import {
  ArrowLeft, Loader2, Save, Trash2, AlertTriangle, CheckCircle2, ShieldCheck,
  Flame, RotateCcw,
} from "lucide-react";

interface UserDetail {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  level: number;
  xp: number;
  streak: number;
  location: string | null;
  skills: string[];
  agreedToTermsAt: string | null;
  agreedTermsVersion: string | null;
  agreedFromIp: string | null;
  createdAt: string;
  updatedAt: string;
  completedLessons: number;
  _count: { progress: number; activityLogs: number; achievements: number };
  progress: Array<{
    completed: boolean;
    score: number;
    lesson: {
      id: string;
      title: string;
      course: { id: string; title: string };
    };
  }>;
  activityLogs: Array<{ type: string; count: number; date: string }>;
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  fontWeight: 700,
  marginBottom: 6,
  display: "block",
};
const inputCls =
  "w-full h-9 px-3 bg-[#0B0B0C] border-2 border-white/[0.08] text-sm text-white outline-none focus:border-[#10B981]/40 font-mono";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: user, isLoading, mutate } = useSWR<UserDetail>(`/api/admin/users/${id}`, fetcher);

  const [draft, setDraft] = useState<{ role: string; level: number; xp: number; streak: number } | null>(null);
  const initialRef = useRef("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    if (user && draft === null) {
      const init = { role: user.role, level: user.level, xp: user.xp, streak: user.streak };
      setDraft(init);
      initialRef.current = JSON.stringify(init);
    }
  }, [user, draft]);

  if (isLoading || !user || !draft) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#10B981]/50 animate-spin" /></div>;
  }

  const dirty = JSON.stringify(draft) !== initialRef.current;

  async function save() {
    if (!draft) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "save failed");
      }
      initialRef.current = JSON.stringify(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  async function resetProgress() {
    const res = await fetch(`/api/admin/users/${id}/reset-progress`, { method: "POST" });
    if (res.ok) {
      setConfirmReset(false);
      mutate();
    } else {
      alert("Не удалось сбросить прогресс");
    }
  }

  async function deleteUser() {
    if (deleteText !== user!.email) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/users");
    else alert("Не удалось удалить");
  }

  const recentCourses = Array.from(
    new Map(user.progress.map((p) => [p.lesson.course.id, p.lesson.course])).values()
  ).slice(0, 8);

  return (
    <div className="space-y-5">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-30 bg-[#0A0A0B]/95 backdrop-blur border-b-2 border-white/10 px-6 py-3 flex items-center gap-3 flex-wrap"
        style={{ marginLeft: -24, marginRight: -24 }}
      >
        <Link href="/admin/users" className="inline-flex items-center gap-2 font-mono text-[11px] text-white/45 hover:text-white">
          <ArrowLeft size={14} />
          К списку
        </Link>
        <span className="w-px h-5 bg-white/10" />
        {user.role === "admin" && (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#10B981]" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
            <ShieldCheck size={11} /> Админ
          </span>
        )}
        {saved && !saving && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#10B981]/70" style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>
            <CheckCircle2 size={12} />
            Сохранено
          </span>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#10B981] text-black hover:bg-[#0da876] disabled:opacity-30"
          style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, boxShadow: dirty ? "3px 3px 0 0 rgba(16,185,129,0.5)" : "none" }}
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Сохранить
        </button>
      </div>

      {/* Profile header */}
      <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5 flex items-center gap-4">
        <div className="w-16 h-16 border-2 border-white/[0.08] bg-[#0B0B0C] flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.image ? (
            <Image src={user.image} alt="" width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[24px] font-mono text-white/55">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[20px] text-white truncate">{user.name || "—"}</div>
          <div className="text-[13px] text-white/55 font-mono truncate">{user.email}</div>
          <div className="text-[11px] text-white/35 font-mono mt-1">
            Регистрация {formatDate(user.createdAt)}
          </div>
        </div>
        <div className="hidden md:grid grid-cols-3 gap-4 text-center">
          <Stat label="Уровень" value={`Lv.${user.level}`} />
          <Stat label="Опыт" value={`${user.xp}`} />
          <Stat label="Серия" value={
            <span className="inline-flex items-center gap-1">
              <Flame size={14} className="text-orange-400" /> {user.streak}
            </span>
          } />
        </div>
      </div>

      {/* Edit fields */}
      <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5 space-y-4">
        <div>
          <span style={labelStyle} className="font-mono">Роль</span>
          <div className="flex gap-2 flex-wrap">
            {(["user", "admin"] as const).map((r) => {
              const active = draft.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDraft((d) => d ? { ...d, role: r } : d)}
                  className="font-mono text-[11px] px-3 py-1.5"
                  style={{
                    border: `2px solid ${active ? "#10B981" : "rgba(255,255,255,0.08)"}`,
                    background: active ? "rgba(16,185,129,0.1)" : "transparent",
                    color: active ? "#10B981" : "rgba(255,255,255,0.55)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {r === "admin" ? "Админ" : "Студент"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label style={labelStyle} className="font-mono">Уровень</label>
            <input
              type="number" min={1} max={999}
              value={draft.level}
              onChange={(e) => setDraft((d) => d ? { ...d, level: Math.max(1, parseInt(e.target.value) || 1) } : d)}
              className={inputCls}
            />
          </div>
          <div>
            <label style={labelStyle} className="font-mono">Опыт (XP)</label>
            <input
              type="number" min={0}
              value={draft.xp}
              onChange={(e) => setDraft((d) => d ? { ...d, xp: Math.max(0, parseInt(e.target.value) || 0) } : d)}
              className={inputCls}
            />
          </div>
          <div>
            <label style={labelStyle} className="font-mono">Серия дней</label>
            <input
              type="number" min={0}
              value={draft.streak}
              onChange={(e) => setDraft((d) => d ? { ...d, streak: Math.max(0, parseInt(e.target.value) || 0) } : d)}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Stats / Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Прогресс">
          <div className="text-[28px] text-white">{user.completedLessons}</div>
          <div className="text-[11px] text-white/45 font-mono">завершённых уроков</div>
          <div className="text-[11px] text-white/35 font-mono mt-2">
            всего попыток: {user._count.progress}
          </div>
        </Card>
        <Card title="Активность">
          <div className="text-[28px] text-white">{user._count.activityLogs}</div>
          <div className="text-[11px] text-white/45 font-mono">записей</div>
          <div className="text-[11px] text-white/35 font-mono mt-2">
            достижений: {user._count.achievements}
          </div>
        </Card>
        <Card title="Согласие 152-ФЗ">
          <div className="text-[12px] text-white/65 font-mono leading-relaxed">
            {user.agreedToTermsAt ? (
              <>
                <div>Принято {formatDate(user.agreedToTermsAt)}</div>
                {user.agreedTermsVersion && <div className="text-white/45">v{user.agreedTermsVersion}</div>}
                {user.agreedFromIp && <div className="text-white/35">IP {user.agreedFromIp}</div>}
              </>
            ) : (
              <span className="text-amber-400/80">Не зафиксировано</span>
            )}
          </div>
        </Card>
      </div>

      {recentCourses.length > 0 && (
        <div className="border-2 border-white/[0.07] bg-[#0F1011] p-5">
          <h2 className="font-mono mb-3" style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>
            § Курсы с прогрессом
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentCourses.map((c) => (
              <Link
                key={c.id}
                href={`/admin/courses/${c.id}`}
                className="font-mono text-[11px] px-3 py-1.5 border-2 border-white/[0.08] text-white/65 hover:border-[#10B981]/30 hover:text-[#10B981]"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="border-2 border-red-500/30 bg-red-500/[0.04] p-4 space-y-4">
        <div className="font-mono text-[11px] text-red-400 inline-flex items-center gap-2" style={{ letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
          <AlertTriangle size={14} />
          Опасная зона
        </div>

        {/* Reset progress */}
        <div className="border-t border-red-500/15 pt-3">
          <div className="text-white/75 text-[12px] font-medium mb-1">Сбросить прогресс</div>
          <p className="text-white/55 text-[12px] mb-2">
            Удалит все записи о пройденных уроках, обнулит XP, уровень и серию. Аккаунт остаётся.
          </p>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-amber-400/60 text-amber-300 hover:bg-amber-500/[0.08]"
              style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
            >
              <RotateCcw size={12} />
              Сбросить
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={resetProgress}
                className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-amber-400 text-black hover:bg-amber-300"
                style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
              >
                Подтвердить сброс
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="font-mono text-[11px] px-3 py-1.5 text-white/40 hover:text-white/70"
              >
                Отмена
              </button>
            </div>
          )}
        </div>

        {/* Delete account */}
        <div className="border-t border-red-500/15 pt-3">
          <div className="text-white/75 text-[12px] font-medium mb-1">Удалить аккаунт</div>
          <p className="text-white/55 text-[12px] mb-2">
            Удаление необратимо. Будут стёрты весь прогресс, активность, достижения, PvP-история.
          </p>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-400 text-red-400 hover:bg-red-500/[0.08]"
              style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
            >
              <Trash2 size={12} />
              Удалить аккаунт
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-white/65 text-[12px]">
                Введите email <code className="text-red-400 px-1 bg-red-500/[0.08]">{user.email}</code>:
              </p>
              <input
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                autoFocus
                className="w-full max-w-md h-8 px-2 bg-[#0B0B0C] border-2 border-red-500/30 text-sm text-white outline-none focus:border-red-500 font-mono"
              />
              <div className="flex gap-2">
                <button
                  onClick={deleteUser}
                  disabled={deleteText !== user.email}
                  className="font-mono text-[11px] inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-red-500 text-black hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}
                >
                  Удалить навсегда
                </button>
                <button
                  onClick={() => { setConfirmDelete(false); setDeleteText(""); }}
                  className="font-mono text-[11px] px-3 py-1.5 text-white/40 hover:text-white/70"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] text-white/40 font-mono" style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>{label}</div>
      <div className="text-[18px] text-white mt-1">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-white/[0.07] bg-[#0F1011] p-4">
      <div className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
