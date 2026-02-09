import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "./providers";

import IdleLogout from "@/components/IdleLogout";

export const metadata: Metadata = {
  title: "Maintenance Dashboard",
  description: "Maintenance Reminder System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen text-white overflow-x-hidden flex flex-col">
        {/* Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#070A12]">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute top-10 -right-40 h-[520px] w-[520px] rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-orange-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        </div>

        <Providers>
          {/* session-related client logic */}
          <IdleLogout minutes={30} />

          {/* App content */}
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
