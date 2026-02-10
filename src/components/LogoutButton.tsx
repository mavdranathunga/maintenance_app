"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2.5 rounded-2xl glass-hover bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] group"
    >
      <LogOut className="h-4 w-4 text-white/40 group-hover:text-red-400 transition-colors" />
      <span className="group-hover:text-red-50 text-white/90">Logout</span>
    </button>
  );
}
