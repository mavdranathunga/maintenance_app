import type { Asset } from "@prisma/client";
import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import AddAssetForm from "./AddAssetForm";
import { deleteAsset } from "./actions";

const DUE_SOON_WINDOW = 14;

export default async function AdminAssetsPage() {
  await requireAdmin();
  const assets: Asset[] = await prisma.asset.findMany({
    orderBy: { updatedAt: "desc" },
  });


  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Assets (Admin)</h1>
          <p className="text-sm opacity-70">Create / edit / delete assets</p>
        </div>
      </header>

      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold">Add Asset</h2>
        <AddAssetForm />
      </section>

      <section className="rounded-2xl border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">All Assets</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr className="border-b">
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Last</th>
                <th className="p-3">Freq</th>
                <th className="p-3">Next Due</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => {
                const nextDue = computeNextDue(a.lastMaintenance, a.frequencyDays);
                const status = computeStatus(nextDue, DUE_SOON_WINDOW);

                return (
                  <tr key={a.id} className="border-b last:border-b-0">
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
                      <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs">
                        {status === "OK" ? "OK" : status === "DUE_SOON" ? "Due Soon" : "Overdue"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <form action={deleteAsset}>
                        <input type="hidden" name="id" value={a.id} />
                        <button className="rounded-lg border px-3 py-1">Delete</button>
                      </form>
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
