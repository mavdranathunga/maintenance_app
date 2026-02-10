import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default async function RecordsPage() {
  await requireAdmin();

  const records = await prisma.maintenanceRecord.findMany({
    orderBy: { performedAt: "desc" },
    take: 500,
    include: { asset: true },
  });

  return (
    <main className="space-y-6">
      <header className="rounded-2xl glass-strong p-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Maintenance Records</h1>
          <p className="text-sm text-white/70">History of completed and rescheduled maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <a className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-2 text-sm transition" href="/admin/reports">
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

      <section className="rounded-2xl glass-strong overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-white/70">
              <tr className="border-b border-white/10">
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Scheduled For</th>
                <th className="p-3">Updated by</th>
                <th className="p-3">Remark</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.04] transition">
                  <td className="p-3">{r.performedAt.toISOString().slice(0, 10)}</td>
                  <td className="p-3">{r.action}</td>
                  <td className="p-3">
                    <div className="font-medium">{r.asset.name}</div>
                    <div className="text-white/60">{r.asset.assetId}</div>
                  </td>
                  <td className="p-3">{r.scheduledFor ? r.scheduledFor.toISOString().slice(0, 10) : "-"}</td>
                  <td className="p-3">{r.updatedByEmail ?? "-"}</td>
                  <td className="p-3">{r.remark ?? "-"}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td className="p-6 text-white/60" colSpan={5}>No records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
