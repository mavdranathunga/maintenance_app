"use client";

import { cn } from "@/lib/utils";

type Status = "OK" | "DUE_SOON" | "OVERDUE";

export default function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    OK: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    DUE_SOON: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    OVERDUE: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  };

  const dotMap: Record<Status, string> = {
    OK: "bg-emerald-500",
    DUE_SOON: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse-soft",
    OVERDUE: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse",
  };

  const label =
    status === "OK" ? "OK" : status === "DUE_SOON" ? "Due Soon" : "Overdue";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase",
        map[status]
      )}
    >
      <div className={cn("h-1.5 w-1.5 rounded-full", dotMap[status])} />
      {label}
    </span>
  );
}
