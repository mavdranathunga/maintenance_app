"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-xl glass glass-hover px-4 py-2 text-sm transition"
    >
      Logout
    </button>
  );
}
