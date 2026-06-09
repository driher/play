import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavBar from "@/components/NavBar";
import BreakingNewsBar from "@/components/BreakingNewsBar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pentas TV",
  description: "Portal Berita Pentas TV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

  {/* GLOBAL NAVBAR */}
  <NavBar />

  {/* BREAKING NEWS (opsional global juga) */}
  <BreakingNewsBar />

  {/* PAGE CONTENT */}
  <main className="flex-1">
    {children}
  </main>
<Footer />
</body>
    </html>
  );
}