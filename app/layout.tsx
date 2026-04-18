import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OSMU Dashboard",
  description: "채널별 One Source Multi Use 현황 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full" style={{ backgroundColor: '#EDE9F5' }}>
        <Sidebar />
        <div className="ml-16 min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 px-6 pb-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
