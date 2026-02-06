export type Status = "OK" | "DUE_SOON" | "OVERDUE";

export function normalizeDate(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function computeNextDue(lastMaintenance: Date, frequencyDays: number) {
  return normalizeDate(addDays(normalizeDate(lastMaintenance), frequencyDays));
}

export function computeStatus(nextDue: Date, dueSoonWindowDays: number) {
  const today = normalizeDate(new Date());
  const nd = normalizeDate(nextDue);

  const diffMs = nd.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "OVERDUE" as const;
  if (diffDays <= dueSoonWindowDays) return "DUE_SOON" as const;
  return "OK" as const;
}
