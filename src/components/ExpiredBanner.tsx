"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ExpiredBanner() {
  const sp = useSearchParams();
  const router = useRouter();
  const reason = sp.get("reason");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reason === "expired") {
      setOpen(true);

      const t = setTimeout(() => {
        dismiss();
      }, 5000);

      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reason]);

  function dismiss() {
    setOpen(false);

    // remove ?reason=expired from URL (no refresh)
    const url = new URL(window.location.href);
    url.searchParams.delete("reason");
    router.replace(url.pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
  }

  if (!open) return null;

  return (
    <div className="fixed left-1/2 top-6 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2">
      <div className="flex items-start justify-between gap-3 rounded-2xl border border-amber-400/30 bg-[#0b1020]/80 px-4 py-3 text-sm text-amber-200 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div>
          <div className="font-medium">Session expired</div>
          <div className="mt-0.5 text-amber-200/80">
            Your session expired due to inactivity. Please sign in again.
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg px-2 py-1 text-amber-200/80 hover:bg-white/10 hover:text-amber-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
