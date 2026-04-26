"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, Loader2, X } from "lucide-react";

const RED      = "#F87171";
const RED_SOFT = "rgba(248,113,113,0.08)";
const RED_LINE = "rgba(248,113,113,0.32)";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (submitting) return;
    setOpen(false);
    setConfirmEmail("");
    setError(null);
  };

  async function handleDelete() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: confirmEmail.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Не удалось удалить аккаунт");
        setSubmitting(false);
        return;
      }
      // Sign out and bounce to landing
      await signOut({ callbackUrl: "/" });
    } catch {
      setError("Сетевая ошибка. Попробуйте ещё раз.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        style={{
          padding: 20,
          border: `2px solid ${RED_LINE}`,
          background: RED_SOFT,
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} style={{ color: RED, marginTop: 2 }} />
          <div className="flex-1 min-w-0">
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Опасная зона
            </div>
            <h3 className="text-white text-[15px] font-semibold mb-1">
              Удалить аккаунт
            </h3>
            <p
              className="text-white/55 text-[13px] leading-relaxed mb-4"
              style={{ maxWidth: 540 }}
            >
              Удаление аккаунта необратимо. Будут удалены ваш профиль, прогресс по
              урокам, накопленный XP, достижения, история PvP и подключённые OAuth-аккаунты.
              Восстановить данные после удаления будет невозможно.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: "transparent",
                color: RED,
                border: `2px solid ${RED}`,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Удалить аккаунт навсегда
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0E0E10",
              border: `2px solid ${RED_LINE}`,
              boxShadow: `8px 8px 0 ${RED}33`,
              maxWidth: 480,
              width: "100%",
              padding: 28,
              position: "relative",
            }}
          >
            <button
              onClick={close}
              disabled={submitting}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "transparent",
                border: 0,
                color: "rgba(255,255,255,0.4)",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              <X size={18} />
            </button>

            <div
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Подтвердите удаление
            </div>
            <h2
              style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontWeight: 300,
                fontSize: 28,
                lineHeight: 1.1,
                color: "#fff",
                margin: "0 0 14px",
              }}
            >
              Удалить аккаунт?
            </h2>
            <p className="text-white/65 text-[14px] leading-relaxed mb-5">
              Это действие необратимо. Чтобы подтвердить, введите ваш email точно
              так же как при регистрации.
            </p>

            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
                setError(null);
              }}
              disabled={submitting}
              placeholder="your@email"
              autoFocus
              className="font-mono"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#0B0B0C",
                border: "2px solid rgba(255,255,255,0.10)",
                color: "#fff",
                fontSize: 13,
                outline: "none",
                marginBottom: 10,
              }}
            />

            {error && (
              <div
                className="font-mono"
                style={{
                  padding: "8px 12px",
                  border: `1.5px solid ${RED_LINE}`,
                  background: RED_SOFT,
                  color: RED,
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={close}
                disabled={submitting}
                className="font-mono"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "transparent",
                  color: "rgba(255,255,255,0.7)",
                  border: "2px solid rgba(255,255,255,0.10)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting || !confirmEmail.trim()}
                className="font-mono"
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 16px",
                  background: RED,
                  color: "#0B0B0C",
                  border: "2px solid #0B0B0C",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  cursor: submitting || !confirmEmail.trim() ? "not-allowed" : "pointer",
                  opacity: !confirmEmail.trim() ? 0.5 : 1,
                  boxShadow: `3px 3px 0 ${RED}66`,
                }}
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
