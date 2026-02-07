import type { Asset } from "@prisma/client";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import { deleteAsset } from "./actions";
import LogoutButton from "@/components/LogoutButton";
import EditAssetButton from "@/app/admin/assets/EditAssetButton";
import StatusBadge from "@/components/StatusBadge";
import AddAssetButton from "./AddAssetButton";


const DUE_SOON_WINDOW = 14;

export default async function AdminAssetsPage() {
  await requireAdmin();
  const assets: Asset[] = await prisma.asset.findMany({
    orderBy: { updatedAt: "desc" },
  });


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
          <a href="/dashboard" className="rounded-xl glass glass-hover px-4 py-2 text-sm transition">Dashboard</a>
          <AddAssetButton />
          <LogoutButton />
        </div>
      </header>
      
      <section className="rounded-2xl glass-strong overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold">All Assets</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr className="border-b border-white/10 text-white/70">
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Last</th>
                <th className="p-3">Freq</th>
                <th className="p-3">Next Due</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => {
                const nextDue = computeNextDue(a.lastMaintenance, a.frequencyDays);
                const status = computeStatus(nextDue, DUE_SOON_WINDOW);

                return (
                  <tr key={a.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.04] transition">
                    <td className="p-3">
                      <div className="font-medium">{a.name}</div>
                      <div className="opacity-70">{a.assetId}</div>
                    </td>
                    <td className="p-3">{a.category}</td>
                    <td className="p-3">{a.location ?? "-"}</td>
                    <td className="p-3">{a.lastMaintenance.toISOString().slice(0, 10)}</td>
                    <td className="p-3">{a.frequencyDays}d</td>
                    <td className="p-3">{nextDue.toISOString().slice(0, 10)}</td>
                    <td className="p-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <EditAssetButton asset={a} />

                        <form action={deleteAsset}>
                          <input type="hidden" name="id" value={a.id} />
                          <button className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs text-rose-200 hover:bg-rose-400/20 transition">
                            Delete
                          </button>
                        </form>
                      </div>

                    </td>
                  </tr>
                );
              })}
              {assets.length === 0 && (
                <tr>
                  <td className="p-6 opacity-70" colSpan={8}>No assets yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
