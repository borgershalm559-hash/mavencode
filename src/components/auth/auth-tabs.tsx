"use client";

interface AuthTabsProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex border-b-2 border-white/[0.08] mb-6">
      <button
        onClick={() => onTabChange("login")}
        className={`flex-1 py-2.5 font-mono text-[12px] uppercase tracking-[0.2em] font-bold transition-colors duration-150 ${
          activeTab === "login"
            ? "bg-[#10B981]/[0.08] text-[#10B981] border-b-2 border-[#10B981] -mb-[2px]"
            : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
        }`}
      >
        [01] Вход
      </button>
      <button
        onClick={() => onTabChange("register")}
        className={`flex-1 py-2.5 font-mono text-[12px] uppercase tracking-[0.2em] font-bold border-l-2 border-white/[0.08] transition-colors duration-150 ${
          activeTab === "register"
            ? "bg-[#10B981]/[0.08] text-[#10B981] border-b-2 border-[#10B981] -mb-[2px]"
            : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
        }`}
      >
        [02] Регистрация
      </button>
    </div>
  );
}
