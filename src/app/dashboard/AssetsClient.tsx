"use client";

import { useMemo, useState } from "react";
import MaintenanceActions from "@/app/admin/assets/MaintenanceActions";


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
          className="rounded-xl glass px-3 py-2 text-sm text-white placeholder:text-white/40 bg-transparent outline-none focus:ring-2 focus:ring-purple-500/30"
          placeholder="Search by name / id / location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="appearance-none rounded-xl glass px-3 py-2 text-sm text-white placeholder:text-white/40 bg-transparent outline-none focus:ring-2 focus:ring-purple-500/30"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="ALL">All Status</option>
          <option value="OK">OK</option>
          <option value="DUE_SOON">Due Soon</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        <select
          className="appearance-none rounded-xl glass px-3 py-2 text-sm text-white placeholder:text-white/40 bg-transparent outline-none focus:ring-2 focus:ring-purple-500/30"
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
      <div className="rounded-2xl glass-strong shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">Assets</div>
          <div className="text-sm opacity-70">{filtered.length} shown</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr className="border-b border-white/10">
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Next Due</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.04] transition">
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
                  <td className="p-3">
                    <div className="inline-flex items-center gap-2">
                      <MaintenanceActions assetId={a.id} />
                    </div>
                  </td>
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
  const label = status === "OK" ? "OK" : status === "DUE_SOON" ? "Due Soon" : "Overdue";

  const cls =
    status === "OK"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
      : status === "DUE_SOON"
      ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
      : "border-rose-300/20 bg-rose-300/10 text-rose-100";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${cls}`}>
      {label}
    </span>
  );
}

