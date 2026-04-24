import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PvP",
};

export default function PvpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
