"use client";

import { useMemo, useState } from "react";
import MaintenanceActions from "@/app/(app)/admin/assets/MaintenanceActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { CheckCircle2, Clock, AlertTriangle, Search, Filter } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6">
      {/* Search + Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-11 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all"
            placeholder="Search assets by name, ID or location..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={status} onValueChange={(v) => setStatus(v as Asset["status"] | "ALL")}>
            <SelectTrigger className="w-[160px] rounded-2xl border border-white/10 bg-white/[0.03] text-white shadow-xl focus:ring-2 focus:ring-purple-500/20 h-full py-3">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-white/40" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>

            <SelectContent className="border border-white/12 bg-background/95 backdrop-blur-3xl text-white shadow-2xl">
              <SelectItem value="ALL" className="focus:bg-white/10">All Status</SelectItem>
              <SelectItem value="OK" className="focus:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Healthy
                </div>
              </SelectItem>
              <SelectItem value="DUE_SOON" className="focus:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Due Soon
                </div>
              </SelectItem>
              <SelectItem value="OVERDUE" className="focus:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500 font-bold" />
                  Overdue
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger className="w-[180px] rounded-2xl border border-white/10 bg-white/[0.03] text-white shadow-xl focus:ring-2 focus:ring-purple-500/20 h-full py-3">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent className="border border-white/12 bg-background/95 backdrop-blur-3xl text-white shadow-2xl">
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="focus:bg-white/10">
                  {c === "ALL" ? "All Categories" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Modern Asset Table */}
      <div className="rounded-[2.5rem] glass-strong shadow-[0_40px_160px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden bg-background/40">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase text-[14px] tracking-widest">Asset Inventory</h2>
            <p className="text-xs text-white/50 font-medium mt-1.5 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-purple-500 animate-pulse" />
              Synchronized with <span className="text-purple-300 font-bold">PostgreSQL Pulse</span>
            </p>
          </div>
          <div className="text-[11px] font-bold text-white/60 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
            MATCHING: <span className="text-white font-extrabold">{filtered.length}</span> / {assets.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/50 font-bold uppercase text-[10px] tracking-[0.2em] bg-white/[0.02]">
                <th className="px-8 py-6">Ident / Name</th>
                <th className="px-6 py-6 border-l border-white/5">Classification</th>
                <th className="px-6 py-6 border-l border-white/5">Locale</th>
                <th className="px-6 py-6 border-l border-white/5">Terminal Date</th>
                <th className="px-6 py-6 border-l border-white/5">Status Core</th>
                <th className="px-6 py-6 border-l border-white/5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((a) => (
                <tr key={a.id} className="group hover:bg-white/[0.04] transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-[15px] group-hover:text-purple-300 transition-colors capitalize">{a.name}</span>
                      <span className="text-[11px] font-mono text-white/40 mt-1 uppercase tracking-tight">{a.assetId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-semibold text-white/80 text-[13px]">{a.category}</td>
                  <td className="px-6 py-6 font-semibold text-white/80 text-[13px]">{a.location ?? "—"}</td>
                  <td className="px-6 py-6 font-bold text-white text-[13px] tabular-nums">{a.nextDue}</td>
                  <td className="px-6 py-6">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-6">
                    <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                      <MaintenanceActions assetId={a.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-16 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-4 animate-bounce">
                <Search className="h-8 w-8 text-white/20" />
              </div>
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No matching telemetry found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

