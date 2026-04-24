"use client";

import { useState, useRef, useEffect, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail, User, Check, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { inputClass, labelClass, containerVariants, itemVariants } from "./constants";

const RL_KEY = (email: string) => `maven-rl-${email.toLowerCase()}`;
const RL_MAX = 5;
const RL_WINDOW_MS = 15 * 60 * 1000;

function getRLData(email: string): { count: number; lockedUntil: number } {
  try {
    const raw = localStorage.getItem(RL_KEY(email));
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
  } catch { return { count: 0, lockedUntil: 0 }; }
}
function setRLData(email: string, data: { count: number; lockedUntil: number }) {
  try { localStorage.setItem(RL_KEY(email), JSON.stringify(data)); } catch {}
}
function clearRL(email: string) {
  try { localStorage.removeItem(RL_KEY(email)); } catch {}
}

const formInit = {
  values: { name: "", email: "", password: "", confirmPassword: "" },
  errors: { name: "", email: "", password: "", confirmPassword: "" },
  touched: { name: false, email: false, password: false, confirmPassword: false },
  showPassword: false,
  showConfirmPassword: false,
};

type FormFields = keyof typeof formInit.values;

function ValidationIcon({
  field,
  touched,
  errors,
  isPasswordLike = false,
}: {
  field: FormFields;
  touched: Record<FormFields, boolean>;
  errors: Record<FormFields, string>;
  isPasswordLike?: boolean;
}) {
  if (!touched[field]) return null;
  const hasError = errors[field] !== "";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={`absolute top-1/2 -translate-y-1/2 ${isPasswordLike ? "right-10" : "right-3"}`}
    >
      {hasError
        ? <X className="w-4 h-4 text-red-500" />
        : <Check className="w-4 h-4 text-emerald-600" />}
    </motion.div>
  );
}

interface AuthFormProps {
  activeTab: "login" | "register";
}

export function AuthForm({ activeTab }: AuthFormProps) {
  const router = useRouter();

  const [form, updateForm] = useReducer(
    (prev: typeof formInit, patch: Partial<typeof formInit>) => ({ ...prev, ...patch }),
    undefined,
    () => ({ ...formInit })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotDone, setForgotDone] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailTaken, setEmailTaken] = useState<boolean | null>(null);
  const [rateLocked, setRateLocked] = useState<number | null>(null);
  const [lockTimer, setLockTimer] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (activeTab === "login") {
      const saved = localStorage.getItem("maven-last-email");
      if (saved) updateForm({ values: { ...formInit.values, email: saved } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!rateLocked) return;
    const update = () => {
      const remaining = Math.ceil((rateLocked - Date.now()) / 1000);
      if (remaining <= 0) { setRateLocked(null); setLockTimer(0); }
      else setLockTimer(remaining);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [rateLocked]);

  const validateName = (v: string) => (v.trim().length < 2 ? "Минимум 2 символа" : "");
  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Некорректный email";
  const validatePassword = (v: string) => (v.length < 8 ? "Минимум 8 символов" : "");
  const validateConfirmPassword = (v: string, password: string) =>
    v !== password ? "Пароли не совпадают" : "";

  const handleInputChange = (field: keyof typeof formInit.values, value: string) => {
    updateForm({
      values: { ...form.values, [field]: value },
      errors: { ...form.errors, [field]: form.errors[field] ? "" : form.errors[field] },
    });
  };

  const handleInputBlur = (field: keyof typeof formInit.values) => {
    const value = form.values[field];
    if (!value.trim()) return;

    let error = "";
    if (field === "name") error = validateName(value);
    else if (field === "email") error = validateEmail(value);
    else if (field === "password") error = validatePassword(value);
    else if (field === "confirmPassword") error = validateConfirmPassword(value, form.values.password);
    updateForm({
      touched: { ...form.touched, [field]: true },
      errors: { ...form.errors, [field]: error },
    });

    if (field === "email" && activeTab === "register" && !error) {
      setEmailTaken(null);
      setEmailChecking(true);
      fetch(`/api/check-email?email=${encodeURIComponent(value.trim().toLowerCase())}`)
        .then((r) => r.json())
        .then((data) => setEmailTaken(data.available === false ? true : false))
        .catch(() => {})
        .finally(() => setEmailChecking(false));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setServerError("");

    if (activeTab === "login") {
      const email = form.values.email.trim().toLowerCase();
      const rl = getRLData(email);
      if (rl.lockedUntil > Date.now()) {
        setRateLocked(rl.lockedUntil);
        return;
      }
    }

    const errors = {
      name: activeTab === "register" ? validateName(form.values.name) : "",
      email: validateEmail(form.values.email),
      password: validatePassword(form.values.password),
      confirmPassword:
        activeTab === "register"
          ? validateConfirmPassword(form.values.confirmPassword, form.values.password)
          : "",
    };
    updateForm({
      errors,
      touched: { name: true, email: true, password: true, confirmPassword: true },
    });

    const hasErrors = Object.values(errors).some((e) => e !== "");
    if (hasErrors) return;
    if (activeTab === "register" && emailTaken) return;

    setIsSubmitting(true);

    try {
      if (activeTab === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.values.name.trim(),
            email: form.values.email.trim().toLowerCase(),
            password: form.values.password,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setServerError(data.error || "Ошибка регистрации");
          setIsSubmitting(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email: form.values.email.trim().toLowerCase(),
        password: form.values.password,
        rememberMe: String(rememberMe),
        redirect: false,
      });

      if (result?.error) {
        if (activeTab === "login") {
          const email = form.values.email.trim().toLowerCase();
          const rl = getRLData(email);
          const newCount = rl.count + 1;
          if (newCount >= RL_MAX) {
            const lockedUntil = Date.now() + RL_WINDOW_MS;
            setRLData(email, { count: newCount, lockedUntil });
            setRateLocked(lockedUntil);
            setServerError("");
          } else {
            setRLData(email, { count: newCount, lockedUntil: 0 });
            const left = RL_MAX - newCount;
            setServerError(`Неверный email или пароль. Осталось попыток: ${left}`);
          }
        } else {
          setServerError("Ошибка входа после регистрации");
        }
        setIsSubmitting(false);
        return;
      }

      try { localStorage.setItem("maven-last-email", form.values.email.trim().toLowerCase()); } catch {}
      if (activeTab === "login") clearRL(form.values.email.trim().toLowerCase());
      setIsSuccess(true);
      setTimeout(() => setIsLeaving(true), 900);
    } catch (e) {
      const isNetwork = e instanceof TypeError && e.message === "Failed to fetch";
      setServerError(isNetwork ? "Нет связи с сервером. Проверьте интернет" : "Произошла ошибка. Попробуйте позже");
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async () => {
    if (forgotLoading || forgotDone) return;
    setForgotError("");
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError("Введите корректный email");
      return;
    }
    setForgotLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });
      setForgotDone(true);
    } catch {
      setForgotError("Нет связи с сервером");
    } finally {
      setForgotLoading(false);
    }
  };

  useEffect(() => {
    updateForm({
      errors: { name: "", email: "", password: "", confirmPassword: "" },
      touched: { name: false, email: false, password: false, confirmPassword: false },
      values: { ...form.values, password: "", confirmPassword: "" },
      showPassword: false,
      showConfirmPassword: false,
    });
    setIsSubmitting(false);
    setEmailTaken(null);
    setEmailChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeTab === "register") nameRef.current?.focus();
      else emailRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const FieldError = ({ field }: { field: keyof typeof formInit.values }) => (
    <div
      className="grid transition-all duration-300 ease-out"
      style={{
        gridTemplateRows: form.touched[field] && form.errors[field] ? "1fr" : "0fr",
        opacity: form.touched[field] && form.errors[field] ? 1 : 0,
      }}
    >
      <div className="overflow-hidden">
        <p className="text-[11px] font-mono text-red-500 mt-1.5 ml-0.5">{form.errors[field]}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Page-leave overlay */}
      {isLeaving && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#0D1117]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onAnimationComplete={() => {
            router.push("/dashboard");
            router.refresh();
          }}
        />
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
        <motion.div
          variants={containerVariants}
          initial={hasAnimated.current ? "visible" : "hidden"}
          animate="visible"
          onAnimationComplete={() => { hasAnimated.current = true; }}
          className="space-y-4"
        >
          {/* Name — register only */}
          <div
            className="grid"
            style={{
              gridTemplateRows: activeTab === "register" ? "1fr" : "0fr",
              opacity: activeTab === "register" ? 1 : 0,
              transition: "grid-template-rows 400ms cubic-bezier(0.22,1,0.36,1), opacity 250ms ease",
            }}
          >
            <div className="overflow-hidden">
              <div className="space-y-0 pb-4">
                <Label className={labelClass}>username / имя</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    ref={nameRef}
                    id="name"
                    placeholder="dmitryk"
                    className={`${inputClass} pr-9`}
                    value={form.values.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleInputBlur("name")}
                    aria-invalid={form.touched.name && form.errors.name !== ""}
                  />
                  <ValidationIcon field="name" touched={form.touched} errors={form.errors} />
                </div>
                <FieldError field="name" />
              </div>
            </div>
          </div>

          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-0">
            <Label className={labelClass}>email / почта</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="you@mavencode.ru"
                className={`${inputClass} pr-9`}
                value={form.values.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleInputBlur("email")}
                aria-invalid={form.touched.email && form.errors.email !== ""}
                autoFocus
              />
              <ValidationIcon field="email" touched={form.touched} errors={form.errors} />
            </div>
            <FieldError field="email" />

            {/* Email availability — register only */}
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: activeTab === "register" && (emailChecking || emailTaken !== null) ? "1fr" : "0fr",
                opacity: activeTab === "register" && (emailChecking || emailTaken !== null) ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 mt-1.5 ml-0.5">
                  {emailChecking ? (
                    <Loader2 className="w-3 h-3 text-white/30 animate-spin" />
                  ) : emailTaken === true ? (
                    <X className="w-3 h-3 text-red-500" />
                  ) : emailTaken === false ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : null}
                  <span className={`text-[11px] font-mono transition-colors duration-200 ${
                    emailChecking ? "text-white/30" :
                    emailTaken === true ? "text-red-400" :
                    "text-emerald-400"
                  }`}>
                    {emailChecking
                      ? "Проверяем…"
                      : emailTaken === true
                      ? "Email уже зарегистрирован"
                      : emailTaken === false
                      ? "Email свободен"
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-0">
            <div className="flex items-center justify-between mb-2">
              <Label className={`${labelClass} mb-0`}>password / пароль</Label>
              {activeTab === "login" && (
                <button
                  type="button"
                  onClick={() => { setShowForgot(!showForgot); setForgotDone(false); setForgotError(""); }}
                  className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-white/35 hover:text-white/70 underline underline-offset-2 transition-colors"
                >
                  сброс
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                id="password"
                type={form.showPassword ? "text" : "password"}
                placeholder={activeTab === "login" ? "••••••••" : "минимум 8 символов"}
                className={`${inputClass} pr-16`}
                value={form.values.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleInputBlur("password")}
                aria-invalid={form.touched.password && form.errors.password !== ""}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {form.touched.password && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {form.errors.password
                      ? <X className="w-4 h-4 text-red-500" />
                      : <Check className="w-4 h-4 text-emerald-600" />}
                  </motion.div>
                )}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => updateForm({ showPassword: !form.showPassword })}
                  className="text-white/25 hover:text-white/60 transition-colors duration-150"
                >
                  {form.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <FieldError field="password" />

            {/* Strength meter — register only */}
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: activeTab === "register" && form.values.password.length > 0 ? "1fr" : "0fr",
                opacity: activeTab === "register" && form.values.password.length > 0 ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="pt-2 pb-0.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {([
                    { label: "Минимум 8 символов", met: form.values.password.length >= 8 },
                    { label: "Цифра (0–9)", met: /\d/.test(form.values.password) },
                    { label: "Заглавная буква", met: /[A-ZА-Я]/.test(form.values.password) },
                    { label: "Спецсимвол (!@#…)", met: /[^A-Za-zА-Яа-я0-9]/.test(form.values.password) },
                  ] as const).map(({ label, met }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`flex-shrink-0 w-3.5 h-3.5 border flex items-center justify-center transition-all duration-200 ${
                        met ? "border-emerald-500/60 bg-emerald-500/[0.08]" : "border-white/[0.12] bg-white/[0.02]"
                      }`}>
                        {met
                          ? <Check className="w-2 h-2 text-emerald-600" />
                          : <X className="w-2 h-2 text-white/20" />}
                      </div>
                      <span className={`text-[11px] font-mono transition-colors duration-200 ${met ? "text-emerald-400" : "text-white/30"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Forgot password panel */}
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: activeTab === "login" && showForgot ? "1fr" : "0fr",
                opacity: activeTab === "login" && showForgot ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="mt-3 p-3 border-2 border-white/[0.07] bg-white/[0.02]">
                  <AnimatePresence mode="wait">
                    {forgotDone ? (
                      <motion.div
                        key="done"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2"
                      >
                        <div className="flex-shrink-0 w-4 h-4 bg-emerald-50 border border-emerald-600 flex items-center justify-center mt-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                        </div>
                        <p className="text-[11px] font-mono text-white/45 leading-relaxed">
                          Если аккаунт с таким email существует — письмо отправлено.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
                        <p className="text-[11px] font-mono text-white/40 leading-relaxed">
                          Введите email — отправим ссылку для сброса пароля
                        </p>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                          <input
                            type="email"
                            placeholder="you@mavencode.ru"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleForgotSubmit()}
                            className="w-full h-9 bg-surface border-2 border-white/[0.08] pl-9 pr-3 text-[12px] font-mono text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#10B981]/50 transition-colors"
                          />
                        </div>
                        {forgotError && <p className="text-[11px] font-mono text-red-400">{forgotError}</p>}
                        <button
                          type="button"
                          onClick={handleForgotSubmit}
                          disabled={forgotLoading}
                          className="w-full h-8 border-2 border-white/[0.12] bg-white/[0.04] text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-white/60 hover:bg-white/[0.08] hover:text-white/90 transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {forgotLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Отправить ссылку →"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Confirm Password — register only */}
          <div
            className="grid"
            style={{
              gridTemplateRows: activeTab === "register" ? "1fr" : "0fr",
              opacity: activeTab === "register" ? 1 : 0,
              transition: "grid-template-rows 400ms cubic-bezier(0.22,1,0.36,1), opacity 250ms ease",
            }}
          >
            <div className="overflow-hidden">
              <div className="space-y-0 pb-1">
                <Label className={labelClass}>подтвердите пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="confirmPassword"
                    type={form.showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    className={`${inputClass} pr-16`}
                    value={form.values.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    onBlur={() => handleInputBlur("confirmPassword")}
                    aria-invalid={form.touched.confirmPassword && form.errors.confirmPassword !== ""}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {form.touched.confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        {form.errors.confirmPassword
                          ? <X className="w-4 h-4 text-red-500" />
                          : <Check className="w-4 h-4 text-emerald-600" />}
                      </motion.div>
                    )}
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => updateForm({ showConfirmPassword: !form.showConfirmPassword })}
                      className="text-white/25 hover:text-white/60 transition-colors duration-150"
                    >
                      {form.showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <FieldError field="confirmPassword" />
              </div>
            </div>
          </div>

          {/* Remember me — login only */}
          <div
            className="grid transition-all duration-300 ease-out"
            style={{
              gridTemplateRows: activeTab === "login" ? "1fr" : "0fr",
              opacity: activeTab === "login" ? 1 : 0,
            }}
          >
            <div className="overflow-hidden">
              <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/35 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-white/20 rounded-none accent-[#10B981]"
                />
                запомнить_устройство =&nbsp;
                <span
                  className="inline-flex items-baseline relative"
                  style={{ minWidth: "3.2em" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={rememberMe ? "true" : "false"}
                      className={rememberMe ? "text-[#10B981]" : "text-red-400/70"}
                      style={{ display: "inline-flex" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      {(rememberMe ? "true" : "false").split("").map((ch, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            delay: i * 0.045,
                            duration: 0.22,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {ch}
                        </motion.span>
                      ))}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span
                    aria-hidden
                    className={rememberMe ? "text-[#10B981]" : "text-red-400/70"}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    style={{ marginLeft: 1 }}
                  >
                    _
                  </motion.span>
                </span>
              </label>
            </div>
          </div>

          {/* Agree — register only */}
          <div
            className="grid transition-all duration-300 ease-out"
            style={{
              gridTemplateRows: activeTab === "register" ? "1fr" : "0fr",
              opacity: activeTab === "register" ? 1 : 0,
            }}
          >
            <div className="overflow-hidden">
              <label className="flex items-start gap-2 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-white/35 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 mt-0.5 border-2 border-white/20 rounded-none flex-shrink-0 accent-[#10B981]" />
                <span>
                  я_согласен(
                  <a
                    href="/legal/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold hover:text-[#10B981] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    условия
                  </a>
                  ,{" "}
                  <a
                    href="/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold hover:text-[#10B981] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    конфиденциальность
                  </a>
                  )
                </span>
              </label>
            </div>
          </div>

          {/* Rate limit block */}
          <div
            className="grid transition-all duration-300 ease-out"
            style={{
              gridTemplateRows: rateLocked ? "1fr" : "0fr",
              opacity: rateLocked ? 1 : 0,
            }}
          >
            <div className="overflow-hidden">
              <div className="border-2 border-amber-500/50 bg-amber-500/[0.06] px-4 py-3 flex items-start gap-2.5">
                <span className="text-lg leading-none">🔒</span>
                <div>
                  <p className="text-sm font-mono font-bold text-amber-400">Слишком много попыток</p>
                  <p className="text-[11px] font-mono text-amber-400/70 mt-0.5">
                    Повторите через{" "}
                    <span className="font-bold">
                      {Math.floor(lockTimer / 60)}:{String(lockTimer % 60).padStart(2, "0")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Server error */}
          <div
            className="grid transition-all duration-300 ease-out"
            style={{
              gridTemplateRows: serverError ? "1fr" : "0fr",
              opacity: serverError ? 1 : 0,
            }}
          >
            <div className="overflow-hidden">
              <div className="border-2 border-red-500/50 bg-red-500/[0.06] px-4 py-3">
                <p className="text-sm font-mono text-red-400">{serverError}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess || !!rateLocked}
              onMouseEnter={(e) => {
                if (!isSubmitting && !isSuccess) {
                  (e.currentTarget as HTMLElement).style.transform = "translate(3px, 3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 0 #10B981";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = isSuccess ? "none" : "6px 6px 0 0 #10B981";
              }}
              className={`group relative w-full flex items-center justify-between gap-2 font-mono font-bold text-sm uppercase tracking-widest px-5 py-4 border-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSuccess
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-black text-white border-black"
              }`}
              style={!isSuccess ? { boxShadow: "6px 6px 0 0 #10B981" } : undefined}
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 w-full justify-between"
                  >
                    <span>{activeTab === "login" ? "Добро пожаловать!" : "Аккаунт создан!"}</span>
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : isSubmitting ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between w-full">
                    <span>{activeTab === "login" ? "Войти" : "Создать аккаунт"} →</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </motion.div>
      </form>
    </>
  );
}
