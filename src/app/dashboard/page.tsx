"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Sidebar } from "@/components/dashboard/sidebar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { ProfileSection } from "@/components/dashboard/profile-section";
import { CoursesSection } from "@/components/dashboard/courses-section";
import { CourseDetail } from "@/components/dashboard/course-detail";
import { NewsSection } from "@/components/dashboard/news-section";
import { LibrarySection } from "@/components/dashboard/library-section";
import { PvpSection } from "@/components/dashboard/pvp-section";
import { SettingsSection } from "@/components/dashboard/settings-section";
import type { UserProfile, CourseListItem, NewsItem, LibraryItem } from "@/types/dashboard";

const smoothTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as const;
const SIDEBAR_KEY = "maven-sidebar-collapsed";
const SIDEBAR_EXPANDED = 250;
const SIDEBAR_COLLAPSED = 68;
const ACCENT = "#10B981";

export default function DashboardPage() {
  const [active, setActive] = useState("profile");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryItem | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored === "true") setCollapsed(true);
    setHydrated(true);
  }, []);

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }, []);

  const { data: profile, isLoading: profileLoading, mutate: mutateProfile } = useSWR<UserProfile>("/api/user/profile", fetcher);
  const { data: courses, isLoading: coursesLoading } = useSWR<CourseListItem[]>("/api/courses", fetcher);
  const { data: news, isLoading: newsLoading } = useSWR<NewsItem[]>("/api/news", fetcher, { revalidateOnFocus: false });
  const { data: library, isLoading: libraryLoading } = useSWR<LibraryItem[]>("/api/library", fetcher, { revalidateOnFocus: false });

  const handleNavigate = (key: string) => {
    setActive(key);
    setSelectedCourse(null);
    setSelectedNews(null);
    setSelectedLibrary(null);
  };

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div
      className="min-h-screen flex items-stretch justify-start p-0 selection:bg-[#10B981] selection:text-black font-sans antialiased overflow-hidden bg-canvas"
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.99, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-none z-20"
      >
        <div
          className="relative grid min-h-screen"
          style={{
            gridTemplateColumns: `${sidebarWidth}px 1fr`,
            transition: hydrated ? "grid-template-columns 0.3s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        >
          <Sidebar
            active={active}
            onNavigate={handleNavigate}
            profile={profile}
            collapsed={collapsed}
            onToggle={handleToggle}
          />

          {/* Vertical divider */}
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-[#10B981]/40 z-30"
            style={{
              left: `${sidebarWidth}px`,
              transition: hydrated ? "left 0.3s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            }}
          />

          <main className="relative px-6 py-8 overflow-y-auto max-h-screen bg-canvas">
            <AnimatePresence mode="wait">
              {selectedCourse ? (
                <motion.div
                  key="course-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={smoothTransition}
                >
                  <CourseDetail courseId={selectedCourse} onBack={() => setSelectedCourse(null)} />
                </motion.div>
              ) : selectedNews ? (
                <motion.div
                  key="news-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={smoothTransition}
                >
                  <NewsSection news={news} loading={newsLoading} selectedNews={selectedNews} onSelectNews={setSelectedNews} onBack={() => setSelectedNews(null)} />
                </motion.div>
              ) : selectedLibrary ? (
                <motion.div
                  key="library-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={smoothTransition}
                >
                  <LibrarySection library={library} loading={libraryLoading} selectedLibrary={selectedLibrary} onSelectLibrary={setSelectedLibrary} onBack={() => setSelectedLibrary(null)} />
                </motion.div>
              ) : (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={smoothTransition}
                  className="space-y-4"
                >
                  <SectionHeader active={active} />
                  {active === "profile" && <ProfileSection profile={profile} loading={profileLoading} onProfileUpdate={(data) => mutateProfile(profile ? { ...profile, ...data } : undefined, { revalidate: true })} onNavigate={handleNavigate} />}
                  {active === "courses" && <CoursesSection courses={courses} loading={coursesLoading} onSelectCourse={setSelectedCourse} />}
                  {active === "news" && <NewsSection news={news} loading={newsLoading} selectedNews={null} onSelectNews={setSelectedNews} onBack={() => {}} />}
                  {active === "library" && <LibrarySection library={library} loading={libraryLoading} selectedLibrary={null} onSelectLibrary={setSelectedLibrary} onBack={() => {}} />}
                  {active === "pvp" && <PvpSection />}
                  {active === "settings" && <SettingsSection />}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(100%); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
