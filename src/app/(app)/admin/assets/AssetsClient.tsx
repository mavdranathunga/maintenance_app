"use client";

import { useMemo, useState } from "react";
import EditAssetButton from "./EditAssetButton";
import DeleteAssetDialog from "./DeleteAssetDialog";
import { type Asset } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, History, MapPin, Package, Mail } from "lucide-react";

export default function AssetsTableClient({ assets }: { assets: Asset[] }) {
  const [q, setQ] = useState("");
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

      const matchesCategory = category === "ALL" ? true : a.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [assets, q, category]);

  return (
    <div className="space-y-6">
      {/* Admin Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-11 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-sans"
            placeholder="Search by name, ID or location..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <Select value={category} onValueChange={(v) => setCategory(v)}>
          <SelectTrigger className="w-[220px] rounded-2xl border border-white/10 bg-white/[0.03] text-white shadow-xl focus:ring-2 focus:ring-indigo-500/20 h-full py-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/40" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>

          <SelectContent className="border border-white/12 bg-background/95 backdrop-blur-3xl text-white shadow-2xl">
            {categories.map((c) => (
              <SelectItem key={c} value={c} className="focus:bg-white/10">
                {c === "ALL" ? "All Classifications" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Admin Asset Table */}
      <div className="rounded-[2.5rem] glass-strong shadow-[0_40px_160px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden bg-background/40">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase text-[13px] tracking-[0.2em]">System Registry</h2>
            <div className="text-[11px] text-white/50 font-bold mt-1.5 uppercase tracking-widest flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-indigo-400" />
              Secure CRUD Access
            </div>
          </div>
          <div className="flex items-center gap-3 font-sans">
            <div className="text-[11px] font-bold text-white/60 bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-tighter shadow-inner">
              ACTIVE_RECORDS: {filtered.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 font-bold uppercase text-[10px] tracking-[0.25em] bg-white/[0.02]">
                <th className="px-8 py-6">Identity / Description</th>
                <th className="px-6 py-6 border-l border-white/5">Specifications</th>
                <th className="px-6 py-6 border-l border-white/5">Assignment</th>
                <th className="px-6 py-6 border-l border-white/5 text-right">Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((a) => (
                <tr key={a.id} className="group hover:bg-white/[0.04] transition-all duration-300">
                  <td className="px-8 py-7 font-sans">
                    <div className="flex flex-col">
                      <span className="font-bold text-white/90 text-[15px] group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{a.name}</span>
                      <div className="flex items-center gap-2 mt-1.5 opacity-40">
                        <span className="text-[10px] font-mono bg-white/10 px-1.5 rounded uppercase tracking-tighter">{a.assetId}</span>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="text-[10px] font-bold">{a.category}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-7 font-sans">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70 text-[12px] font-medium">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                        {a.location || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-[11px]">
                        <History className="h-3.5 w-3.5 text-indigo-400/50" />
                        Every {a.frequencyDays} days
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-7 font-sans">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                        <Mail className="h-3.5 w-3.5 text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-white/70">{a.assignedTo?.split('@')[0] || "Unassigned"}</span>
                        <span className="text-[9px] text-white/30 truncate max-w-[120px]">{a.assignedTo}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-7">
                    <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                      <EditAssetButton asset={a} />
                      <DeleteAssetDialog id={a.id} name={a.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center font-sans">
              <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-white/10" />
              </div>
              <h3 className="text-white/60 font-bold uppercase tracking-[0.2em] text-[11px]">No assets found in registry</h3>
              <p className="text-white/20 text-xs mt-2 font-medium">Try adjusting your filters or adding a new identity record</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
