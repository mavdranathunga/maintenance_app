"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-xl glass px-4 py-2 text-sm transition duration-200 hover:!bg-red-500/80 hover:!text-white"
    >
      Logout
    </button>
  );
}
