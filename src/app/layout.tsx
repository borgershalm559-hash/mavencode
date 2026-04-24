import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MavenCode",
    template: "%s | MavenCode",
  },
  description: "Платформа для обучения программированию с геймификацией, интерактивными уроками и PvP-режимом.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "MavenCode",
    description: "Платформа для обучения программированию с геймификацией, интерактивными уроками и PvP-режимом.",
    images: ["/logo.svg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MavenCode",
    description: "Платформа для обучения программированию с геймификацией, интерактивными уроками и PvP-режимом.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
