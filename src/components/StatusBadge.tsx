type Status = "OK" | "DUE_SOON" | "OVERDUE";

export default function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    OK: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    DUE_SOON: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    OVERDUE: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  };

  const label =
    status === "OK" ? "OK" : status === "DUE_SOON" ? "Due Soon" : "Overdue";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${map[status]}`}
    >
      {label}
    </span>
  );
}
