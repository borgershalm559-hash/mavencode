import { User, GraduationCap, Newspaper, BookOpen, Swords, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Section {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const sections: Section[] = [
  { key: "profile",  label: "Профиль",    icon: User },
  { key: "courses",  label: "Курсы",      icon: GraduationCap },
  { key: "news",     label: "Новости",    icon: Newspaper },
  { key: "library",  label: "Библиотека", icon: BookOpen },
  { key: "pvp",      label: "PVP",        icon: Swords },
  { key: "settings", label: "Настройки",  icon: Settings },
];

