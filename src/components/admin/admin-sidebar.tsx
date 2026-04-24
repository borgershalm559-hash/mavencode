"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GraduationCap, Newspaper, BookOpen, Users, ArrowLeft } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Курсы", icon: GraduationCap },
  { href: "/admin/news", label: "Новости", icon: Newspaper },
  { href: "/admin/library", label: "Библиотека", icon: BookOpen },
  { href: "/admin/users", label: "Пользователи", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-surface border-r-2 border-white/[0.07] flex flex-col min-h-screen">
      <div className="px-4 py-4 border-b-2 border-white/[0.07]">
        <div className="text-[#10B981] font-mono font-bold text-sm uppercase tracking-[0.2em]">Admin Panel</div>
      </div>

      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-mono transition-all ${
                isActive
                  ? "text-[#10B981] bg-[#10B981]/[0.06] border-l-[3px] border-[#10B981]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.03] border-l-[3px] border-transparent"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t-2 border-white/[0.05]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-white/30 font-mono hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Вернуться в дашборд
        </Link>
      </div>
    </aside>
  );
}
