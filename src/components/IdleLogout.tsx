"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function IdleLogout({ minutes = 15 }: { minutes?: number }) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const reset = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        signOut({ callbackUrl: "/?reason=expired" });
      }, minutes * 60 * 1000);
    };

    // start timer
    reset();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [minutes]);

  return null;
}
