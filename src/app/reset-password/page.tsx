"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Check, X, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inputClass, labelClass } from "@/components/auth/constants";

const ACCENT = "#10B981";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const rules = [
    { label: "Минимум 12 символов", met: password.length >= 12 },
    { label: "Цифра (0–9)", met: /\d/.test(password) },
    { label: "Заглавная буква", met: /[A-ZА-Я]/.test(password) },
    { label: "Спецсимвол (!@#…)", met: /[^A-Za-zА-Яа-я0-9]/.test(password) },
  ];
  const allRulesMet = rules.every((r) => r.met);
  const passwordsMatch = password === confirm && confirm.length > 0;

  useEffect(() => {
    if (!token) router.replace("/");
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    setError("");

    if (!allRulesMet) return setError("Пароль не соответствует требованиям");
    if (password !== confirm) return setError("Пароли не совпадают");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка"); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => router.push("/"), 2500);
    } catch {
      setError("Нет связи с сервером");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6 font-sans antialiased selection:bg-[#10B981] selection:text-black"
      style={{ background: "#0D1117" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: ACCENT }} />

      {/* Corner label */}
      <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 select-none z-10">
        mavencode / сброс пароля
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px] z-20 bg-white text-black border-2 border-white p-8"
        style={{ boxShadow: `6px 6px 0 0 ${ACCENT}` }}
      >
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="inline-flex items-center justify-center w-7 h-7 border-2 flex-shrink-0"
              style={{ borderColor: `${ACCENT}60`, background: `${ACCENT}18` }}
            >
              <span className="font-mono font-bold text-sm" style={{ color: ACCENT }}>M</span>
            </div>
            <span className="font-mono text-[15px] font-semibold tracking-tight text-black">
              maven<span style={{ color: ACCENT }}>code</span>
            </span>
          </div>
          <h1 className="font-mono text-[22px] font-bold uppercase text-black">
            &gt;&gt;&gt; Новый пароль
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mt-1">
            сброс.sh
          </p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div
                className="w-14 h-14 border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-mono font-bold uppercase tracking-[0.1em] text-black mb-1">
                Пароль изменён!
              </p>
              <p className="font-mono text-[11px] text-black/40 uppercase tracking-[0.1em]">
                Перенаправляем на страницу входа…
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Password */}
              <div>
                <Label className={labelClass}>password / новый пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Минимум 12 символов"
                    className={`${inputClass} pr-10`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors duration-150"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Checklist */}
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{
                    gridTemplateRows: password.length > 0 ? "1fr" : "0fr",
                    opacity: password.length > 0 ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2.5 pb-0.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {rules.map(({ label, met }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div className={`flex-shrink-0 w-3.5 h-3.5 border flex items-center justify-center transition-all duration-200 ${
                            met ? "border-emerald-600 bg-emerald-50" : "border-black/15"
                          }`}>
                            {met
                              ? <Check className="w-2 h-2 text-emerald-600" />
                              : <X className="w-2 h-2 text-black/20" />}
                          </div>
                          <span className={`text-[11px] font-mono transition-colors duration-200 ${met ? "text-emerald-700" : "text-black/30"}`}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <Label className={labelClass}>confirm / подтвердите пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Повторите пароль"
                    className={`${inputClass} pr-16`}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {confirm.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        {passwordsMatch
                          ? <Check className="w-4 h-4 text-emerald-600" />
                          : <X className="w-4 h-4 text-red-500" />}
                      </motion.div>
                    )}
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-black/30 hover:text-black transition-colors duration-150"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              <div
                className="grid transition-all duration-300"
                style={{ gridTemplateRows: error ? "1fr" : "0fr", opacity: error ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <div className="border-2 border-red-500 bg-red-50 px-4 py-3">
                    <p className="text-sm font-mono text-red-600">{error}</p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLElement).style.transform = "translate(3px, 3px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `3px 3px 0 0 ${ACCENT}`;
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0 0 ${ACCENT}`;
                }}
                className="w-full flex items-center justify-between px-5 py-4 bg-black text-white border-2 border-black font-mono font-bold text-sm uppercase tracking-widest transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: `6px 6px 0 0 ${ACCENT}` }}
              >
                <span>
                  {loading ? "Сохраняем…" : "Сохранить пароль →"}
                </span>
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Check className="w-4 h-4" />}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-black/40 hover:text-black transition-colors duration-150"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Вернуться ко входу
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
