"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm transition duration-200 hover:!bg-red-500/80 hover:!text-white"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
