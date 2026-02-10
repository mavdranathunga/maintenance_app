"use client";

import { useMemo, useState } from "react";
import EditAssetButton from "@/app/(app)/admin/assets/EditAssetButton";
import DeleteAssetDialog from "@/app/(app)/admin/assets/DeleteAssetDialog";
import AddAssetButton from "./AddAssetButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Search } from "lucide-react";

export type AssetRow = {
  id: string;
  assetId: string;
  name: string;
  category: string;
  location: string | null;
  frequencyDays: number;
  lastMaintenance: Date;
  assignedTo: string | null;
  notes: string | null;
};

const input =
  "w-full rounded-xl glass px-3 py-2 text-sm text-white placeholder:text-white/40 bg-transparent outline-none focus:ring-2 focus:ring-purple-500/30";

const select =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20";

export default function AssetsTableClient({
  assets,
  categories,
  locations,
}: {
  assets: AssetRow[];
  categories: string[];
  locations: string[];
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("ALL");
  const [location, setLocation] = useState("ALL");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    return assets.filter((a) => {
      const matchesSearch =
        !needle ||
        a.assetId.toLowerCase().includes(needle) ||
        a.name.toLowerCase().includes(needle) ||
        (a.location ?? "").toLowerCase().includes(needle) ||
        a.category.toLowerCase().includes(needle);

      const matchesCategory = category === "ALL" || a.category === category;
      const matchesLocation =
        location === "ALL" || (a.location ?? "-") === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [assets, q, category, location]);

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-col gap-3 md:flex-row md:flex-1">
          {/* Search */}
          <div className="relative md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
            <input
              className={`${input} pl-10`}
              placeholder="Search by asset id / name / category / location..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              className="md:w-48 w-full rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] focus:ring-2 focus:ring-purple-500/30"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent className="border border-white/12 bg-[#0b1020]/90 backdrop-blur-xl text-white shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
              <SelectItem className="focus:bg-white/10 focus:text-white" value="ALL">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="focus:bg-white/10 focus:text-white">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Location */}
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger
              className="md:w-48 w-full rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] focus:ring-2 focus:ring-purple-500/30"
            >
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>

            <SelectContent className="border border-white/12 bg-[#0b1020]/90 backdrop-blur-xl text-white shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
              <SelectItem className="focus:bg-white/10 focus:text-white" value="ALL">All Locations</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l} value={l} className="focus:bg-white/10 focus:text-white">
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:ml-4 md:self-start">
            <AddAssetButton />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-strong shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">All Assets</h2>
          <div className="mt-3 text-xs text-white/60">
            Showing <span className="text-white/80">{filtered.length}</span> of{" "}
            <span className="text-white/80">{assets.length}</span> assets
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="mx-auto w-full max-w-5xl text-sm">
            <thead className="text-left opacity-70">
              <tr className="border-b border-white/10 text-white/70">
                <th className="p-3">Asset ID</th>
                <th className="p-3">Asset name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3 text-center">Frequency</th>
                <th className="p-3 text-center w-[220px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.04] transition"
                >
                  <td className="p-3 text-white/80">{a.assetId}</td>
                  <td className="p-3">
                    <div className="font-medium">{a.name}</div>
                  </td>
                  <td className="p-3">{a.category}</td>
                  <td className="p-3">{a.location ?? "-"}</td>
                  <td className="p-3 text-center">{a.frequencyDays}d</td>

                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <div className="shrink-0">
                        <EditAssetButton asset={a} />
                      </div>
                      <div className="shrink-0">
                        <DeleteAssetDialog
                          assetId={a.id}
                          label={`${a.name} (${a.assetId})`}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-white/60" colSpan={6}>
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
