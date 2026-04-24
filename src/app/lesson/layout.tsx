import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Урок",
};

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
