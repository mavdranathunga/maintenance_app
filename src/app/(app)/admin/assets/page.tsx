import type { Asset } from "@prisma/client";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import AddAssetButton from "./AddAssetButton";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import AssetsTableClient from "./AssetsClient";

export default async function AdminAssetsPage() {
  await requireAdmin();

  const assets = await prisma.asset.findMany({
  orderBy: { assetId: "desc" },
  select: {
    id: true,
    assetId: true,
    name: true,
    category: true,
    location: true,
    frequencyDays: true,
    lastMaintenance: true,
    assignedTo: true,
    notes: true,
  },
});

  const categories = Array.from(new Set(assets.map((a) => a.category))).sort();

  const locations = Array.from(
    new Set(assets.map((a) => a.location).filter(Boolean))
  ).sort() as string[];

  return (
    <main className="p-6 space-y-6">
      <header className="rounded-2xl glass-strong p-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Asset Management
          </h1>
          <p className="text-sm text-white/70">
            Admin • Create, update, and schedule maintenance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-2 transition" href="/admin/reports">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            Reports
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-2 text-sm transition"
          >
            <LayoutDashboard className="h-4 w-4 text-purple-400" />
            Dashboard
          </a>
          <LogoutButton />
        </div>
      </header>

      <AssetsTableClient
        assets={assets}
        categories={categories}
        locations={locations}
      />
      
    </main>
  );
}
