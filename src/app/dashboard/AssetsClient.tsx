"use client";

import { useMemo, useState } from "react";

type Asset = {
  id: string;
  assetId: string;
  name: string;
  category: string;
  location: string | null;
  lastMaintenance: string; // YYYY-MM-DD
  frequencyDays: number;
  assignedTo: string | null;
  notes: string | null;

  nextDue: string; // YYYY-MM-DD
  status: "OK" | "DUE_SOON" | "OVERDUE";
};

export default function AssetsClient({ assets }: { assets: Asset[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | Asset["status"]>("ALL");
  const [category, setCategory] = useState<string>("ALL");

  const categories = useMemo(() => {
    const set = new Set(assets.map((a) => a.category).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [assets]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return assets.filter((a) => {
      const matchesQuery =
        !query ||
        a.name.toLowerCase().includes(query) ||
        a.assetId.toLowerCase().includes(query) ||
        (a.location ?? "").toLowerCase().includes(query);

      const matchesStatus = status === "ALL" ? true : a.status === status;
      const matchesCategory = category === "ALL" ? true : a.category === category;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [assets, q, status, category]);

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="grid gap-3 md:grid-cols-3">
        <input
          className="rounded-xl border p-2 md:col-span-1"
          placeholder="Search by name / id / location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="rounded-xl border p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="ALL">All Status</option>
          <option value="OK">OK</option>
          <option value="DUE_SOON">Due Soon</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        <select
          className="rounded-xl border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "ALL" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">Assets</div>
          <div className="text-sm opacity-70">{filtered.length} shown</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr className="border-b">
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Next Due</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b last:border-b-0">
                  <td className="p-3">
                    <div className="font-medium">{a.name}</div>
                    <div className="opacity-70">{a.assetId}</div>
                  </td>
                  <td className="p-3">{a.category}</td>
                  <td className="p-3">{a.location ?? "-"}</td>
                  <td className="p-3">{a.nextDue}</td>
                  <td className="p-3">
                    <Badge status={a.status} />
                  </td>
                  <td className="p-3">{a.assignedTo ?? "-"}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 opacity-70" colSpan={6}>
                    No matching assets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Badge({ status }: { status: "OK" | "DUE_SOON" | "OVERDUE" }) {
  const label =
    status === "OK" ? "OK" : status === "DUE_SOON" ? "Due Soon" : "Overdue";
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs">
      {label}
    </span>
  );
}
