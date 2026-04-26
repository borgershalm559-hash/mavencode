"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";

const G      = "#10B981";
const G_SOFT = "rgba(16,185,129,0.06)";
const G_LINE = "rgba(16,185,129,0.24)";

export function ExportDataSection() {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleExport() {
    setDownloading(true);
    setDone(false);
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) {
        setDownloading(false);
        return;
      }
      const blob = await res.blob();

      // Pull filename from Content-Disposition if present
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(cd);
      const filename = match?.[1] ?? `mavencode-export-${Date.now()}.json`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch {
      // silent — user just sees button reset
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      style={{
        padding: 20,
        border: `2px solid ${G_LINE}`,
        background: G_SOFT,
      }}
    >
      <div className="flex items-start gap-3">
        <Download size={18} style={{ color: G, marginTop: 2 }} />
        <div className="flex-1 min-w-0">
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: G,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Право на доступ к данным
          </div>
          <h3 className="text-white text-[15px] font-semibold mb-1">
            Экспорт ваших данных
          </h3>
          <p
            className="text-white/55 text-[13px] leading-relaxed mb-4"
            style={{ maxWidth: 540 }}
          >
            Скачайте JSON-файл со всеми вашими данными: профиль, прогресс по урокам,
            достижения, активность, история PvP. Секреты (хеш пароля, OAuth-токены)
            в файл не попадают.
          </p>
          <button
            onClick={handleExport}
            disabled={downloading}
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              background: G,
              color: "#0B0B0C",
              border: "2px solid #0B0B0C",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              cursor: downloading ? "not-allowed" : "pointer",
              boxShadow: downloading ? "none" : `3px 3px 0 ${G}66`,
              opacity: downloading ? 0.7 : 1,
            }}
          >
            {downloading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Готовлю файл...
              </>
            ) : done ? (
              <>
                <Check size={12} />
                Скачано
              </>
            ) : (
              <>
                <Download size={12} />
                Скачать JSON
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
