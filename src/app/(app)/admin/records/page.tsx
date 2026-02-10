import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard, History, ShieldCheck, Mail, Database } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import RecordsTabs from "./RecordsTabs";

export default async function RecordsPage() {
  await requireAdmin();

  const records = await prisma.maintenanceRecord.findMany({
    orderBy: { performedAt: "desc" },
    take: 500,
    include: { asset: true },
  });

  const auditLogs = await prisma.assetAuditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 500,
  });


  return (
    <main className="p-6 space-y-12 max-w-7xl mx-auto">
      {/* Branded Records Header */}
      <header className="relative overflow-hidden rounded-[2rem] glass-strong shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-white/10 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -ml-32 -mb-32" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 flex items-center justify-center border border-white/15 shadow-xl backdrop-blur-md">
              <History className="h-8 w-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400/80 uppercase">Registry Control</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white/95 mt-0.5">Records Center</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <a
              className="flex items-center gap-2.5 rounded-2xl glass-hover bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all"
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4 text-white/40" />
              Return to Dashboard
            </a>
            <div className="h-8 w-px bg-white/10 mx-1 hidden md:block" />
            <LogoutButton />
          </div>
        </div>
      </header>

      <RecordsTabs
        maintenanceCount={records.length}
        auditCount={auditLogs.length}
        maintenanceTable={
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase text-[13px] tracking-[0.2em]">Maintenance Execution Registry</h2>
                <p className="text-[11px] text-white/40 font-bold mt-1 uppercase tracking-widest">Operational Service Logs</p>
              </div>
            </div>

            <div className="rounded-[2rem] glass-strong shadow-2xl border border-white/10 overflow-hidden bg-background/40">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="text-left text-white/30 font-bold uppercase text-[9px] tracking-[0.25em] bg-white/[0.02]">
                      <th className="px-8 py-5">Date</th>
                      <th className="px-6 py-5 border-l border-white/5">Action</th>
                      <th className="px-6 py-5 border-l border-white/5">Asset</th>
                      <th className="px-6 py-5 border-l border-white/5">Operator</th>
                      <th className="px-8 py-5 border-l border-white/5">Report Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {records.map((r) => (
                      <tr key={r.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-white/90 text-xs">{r.performedAt.toISOString().slice(0, 10)}</span>
                            <span className="text-[9px] text-white/30 mt-0.5 uppercase font-mono">{r.performedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 border-l border-white/5">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                            r.action === "COMPLETED" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          )}>
                            {r.action}
                          </span>
                        </td>
                        <td className="px-6 py-6 border-l border-white/5">
                          <div className="flex flex-col">
                            <span className="font-bold text-white/80 text-[12px] group-hover:text-amber-300 transition-colors uppercase">{r.asset.name}</span>
                            <span className="text-[9px] font-mono text-white/30">{r.asset.assetId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 border-l border-white/5">
                          <span className="text-[11px] font-medium text-white/50">{r.updatedByEmail?.split('@')[0] || "System"}</span>
                        </td>
                        <td className="px-8 py-6 border-l border-white/5">
                          <p className="text-xs text-white/40 italic line-clamp-1">{r.remark || "—"}</p>
                        </td>
                      </tr>
                    ))}
                    {records.length === 0 && (
                      <tr><td colSpan={5} className="py-20 text-center text-white/20 text-xs uppercase font-bold tracking-widest">No maintenance logs found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        }
        auditTable={
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase text-[13px] tracking-[0.2em]">System Registry Audit</h2>
                <p className="text-[11px] text-white/40 font-bold mt-1 uppercase tracking-widest">Administrative Lifecycle Events</p>
              </div>
            </div>

            <div className="rounded-[2rem] glass-strong shadow-2xl border border-white/10 overflow-hidden bg-background/40">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="text-left text-white/30 font-bold uppercase text-[9px] tracking-[0.25em] bg-white/[0.02]">
                      <th className="px-8 py-5">Timestamp</th>
                      <th className="px-6 py-5 border-l border-white/5">Audit Event</th>
                      <th className="px-6 py-5 border-l border-white/5">Asset ID</th>
                      <th className="px-6 py-5 border-l border-white/5">Originator</th>
                      <th className="px-8 py-5 border-l border-white/5">Technical Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((l: any) => (
                      <tr key={l.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-white/90 text-xs">{l.timestamp.toISOString().slice(0, 10)}</span>
                            <span className="text-[9px] text-white/30 mt-0.5 uppercase font-mono">{l.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 border-l border-white/5">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                            l.action === "CREATE" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                              l.action === "DELETE" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                          )}>
                            {l.action}
                          </span>
                        </td>
                        <td className="px-6 py-6 border-l border-white/5">
                          <div className="flex flex-col">
                            <span className="font-bold text-white/80 text-[12px] group-hover:text-blue-300 transition-colors uppercase">{l.originalName || "ENTRY"}</span>
                            <span className="text-[9px] font-mono text-white/30">{l.assetId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 border-l border-white/5">
                          <span className="text-[11px] font-medium text-white/50">{l.performedBy?.split('@')[0] || "System"}</span>
                        </td>
                        <td className="px-8 py-6 border-l border-white/5">
                          <p className="text-xs text-white/40 italic line-clamp-1">{l.details || "—"}</p>
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr><td colSpan={5} className="py-20 text-center text-white/20 text-xs uppercase font-bold tracking-widest">No audit events found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        }
      />
    </main>
  );
}
