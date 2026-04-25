"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { GlassCard } from "../glass-card";

const inputClass =
  "h-10 bg-surface border-2 border-white/[0.07] focus:border-[#10B981]/60 text-white/90 rounded-none transition-all duration-200 placeholder:text-white/25 pl-11 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none";

const labelClass =
  "block text-[11px] font-mono uppercase tracking-[0.12em] mb-2 text-white/40";

interface Req { label: string; met: boolean }

function getRequirements(pw: string): Req[] {
  return [
    { label: "Минимум 12 символов", met: pw.length >= 12 },
    { label: "Цифра (0–9)",        met: /\d/.test(pw) },
    { label: "Заглавная буква",    met: /[A-ZА-Я]/.test(pw) },
    { label: "Спецсимвол (!@#…)",  met: /[^A-Za-zА-Яа-я0-9]/.test(pw) },
  ];
}

export function PasswordSection() {
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [pwSaving, setPwSaving]                 = useState(false);
  const [pwError, setPwError]                   = useState("");
  const [pwSuccess, setPwSuccess]               = useState(false);

  const requirements = getRequirements(newPassword);
  const allMet       = requirements.every((r) => r.met);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const canSave = allMet && passwordsMatch && currentPassword.length > 0 && !pwSaving;

  const startPasswordChange = () => {
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setPwError(""); setPwSuccess(false);
    setShowCurrent(false); setShowNew(false); setShowConfirm(false);
    setChangingPassword(true);
  };

  const cancelPasswordChange = () => {
    setChangingPassword(false);
    setPwError(""); setPwSuccess(false);
  };

  const savePassword = async () => {
    if (!allMet) { setPwError("Пароль не соответствует требованиям"); return; }
    if (!passwordsMatch) { setPwError("Пароли не совпадают"); return; }
    setPwSaving(true); setPwError("");
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setPwError(data.error || "Ошибка смены пароля");
        return;
      }
      setPwSuccess(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => { setChangingPassword(false); setPwSuccess(false); }, 2000);
    } catch {
      setPwError("Произошла ошибка. Попробуйте позже");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-white/90">Безопасность</div>
        {!changingPassword && (
          <button
            onClick={startPasswordChange}
            className="flex items-center gap-2 h-9 px-4 bg-white/[0.04] border-2 border-white/[0.07] hover:bg-white/[0.06] hover:border-[#10B981]/25 text-white/40 hover:text-[#10B981]/70 text-xs font-mono font-semibold uppercase tracking-[0.15em] transition-all duration-200"
          >
            <Lock className="size-3.5" />
            Сменить пароль
          </button>
        )}
      </div>

      {/* Collapsible form */}
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: changingPassword ? "1fr" : "0fr", opacity: changingPassword ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-3">
            {pwSuccess ? (
              <div className="bg-emerald-50 border-2 border-emerald-400/40 px-4 py-3 flex items-center gap-2">
                <Check className="size-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700 font-mono">Пароль успешно изменён</p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Current password */}
                <div className="space-y-2 group">
                  <Label className={labelClass}>Текущий пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 transition-colors group-focus-within:text-[#10B981]/60" />
                    <Input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Введите текущий пароль"
                      className={`${inputClass} pr-10`}
                    />
                    <button type="button" tabIndex={-1}
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                      {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-2 group">
                  <Label className={labelClass}>Новый пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 transition-colors group-focus-within:text-[#10B981]/60" />
                    <Input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Минимум 12 символов"
                      className={`${inputClass} pr-10`}
                    />
                    <button type="button" tabIndex={-1}
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                      {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>

                  {/* Requirements checklist */}
                  {newPassword.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                      {requirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-1.5">
                          <div className={`size-3.5 flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-200 ${
                            req.met ? "bg-emerald-500/15 border-emerald-500/40" : "bg-white/[0.03] border-white/[0.07]"
                          }`}>
                            {req.met && <Check className="size-2 text-emerald-600" />}
                          </div>
                          <span className={`font-mono text-[11px] transition-colors duration-200 ${req.met ? "text-emerald-400/80" : "text-white/30"}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2 group">
                  <Label className={labelClass}>Подтверждение пароля</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 transition-colors group-focus-within:text-[#10B981]/60" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Повторите новый пароль"
                      className={`${inputClass} pr-16`}
                    />
                    {/* Match indicator */}
                    {confirmPassword.length > 0 && (
                      <div className={`absolute right-10 top-1/2 -translate-y-1/2 size-4 flex items-center justify-center border-2 transition-colors duration-200 ${
                        passwordsMatch ? "bg-emerald-500/15 border-emerald-500/40" : "bg-red-500/10 border-red-500/30"
                      }`}>
                        {passwordsMatch
                          ? <Check className="size-2.5 text-emerald-600" />
                          : <X className="size-2.5 text-red-500" />
                        }
                      </div>
                    )}
                    <button type="button" tabIndex={-1}
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                      {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: pwError ? "1fr" : "0fr", opacity: pwError ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <div className="bg-red-50 border-2 border-red-400/40 px-4 py-3">
                      <p className="font-mono text-sm text-red-600">{pwError}</p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={savePassword}
                    disabled={!canSave}
                    className="h-10 px-5 bg-gradient-to-r from-[#10B981] to-[#047857] text-black border-2 border-black font-mono font-semibold text-xs uppercase tracking-[0.15em] flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    style={{ boxShadow: canSave ? "3px 3px 0 0 rgba(16,185,129,0.5)" : "none" }}
                  >
                    {pwSaving
                      ? <Loader2 className="size-4 animate-spin" />
                      : <><Check className="size-3.5" /><span>Сохранить</span></>
                    }
                  </button>
                  <button
                    onClick={cancelPasswordChange}
                    disabled={pwSaving}
                    className="h-10 px-5 bg-surface border-2 border-white/[0.07] hover:border-white/[0.15] text-white/40 hover:text-white/70 font-mono font-medium text-xs uppercase tracking-[0.15em] flex items-center gap-2 transition-all duration-200"
                  >
                    <X className="size-3.5" />
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
