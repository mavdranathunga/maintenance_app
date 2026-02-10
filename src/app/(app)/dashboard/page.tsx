import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import AssetsClient from "./AssetsClient";
import LogoutButton from "@/components/LogoutButton";
import { Package, BarChart3, Clock, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";


const DUE_SOON_WINDOW = 14;

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/signin");

  const role = session.user.role;

  const assets = await prisma.asset.findMany({ orderBy: { updatedAt: "desc" } });

  const view = assets.map((a) => {
    const nextDue = computeNextDue(a.lastMaintenance, a.frequencyDays);
    const status = computeStatus(nextDue, DUE_SOON_WINDOW);
    return {
      id: a.id,
      assetId: a.assetId,
      name: a.name,
      category: a.category,
      location: a.location,
      lastMaintenance: a.lastMaintenance.toISOString().slice(0, 10),
      frequencyDays: a.frequencyDays,
      assignedTo: a.assignedTo,
      notes: a.notes,
      nextDue: nextDue.toISOString().slice(0, 10),
      status,
    };
  });

  const overdueCount = view.filter(a => a.status === "OVERDUE").length;
  const dueSoonCount = view.filter(a => a.status === "DUE_SOON").length;

  return (
    <main className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <header className="relative overflow-hidden rounded-[2rem] glass-strong shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-white/10 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-32 -mb-32" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/15 shadow-xl backdrop-blur-md">
              <ShieldCheck className="h-8 w-8 text-purple-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white/95">Maintenance Dashboard</h1>
              <p className="text-sm text-white/50 font-medium mt-1">
                Welcome back, <span className="text-white/80">{session.user?.name || session.user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {role === "ADMIN" && (
              <a className="flex items-center gap-2.5 rounded-2xl glass-hover bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all" href="/admin/reports">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Reports
              </a>
            )}
            {role === "ADMIN" && (
              <a className="flex items-center gap-2.5 rounded-2xl glass-hover bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all" href="/admin/assets">
                <Package className="h-4 w-4 text-purple-400" />
                Assets
              </a>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Quick Stats Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-[1.5rem] p-6 border-white/10 flex items-center gap-5 shadow-lg group hover:border-white/20 transition-all">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
            <Package className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Total Assets</p>
            <p className="text-2xl font-bold text-white mt-1">{assets.length}</p>
          </div>
        </div>

        <div className="glass-card rounded-[1.5rem] p-6 border-white/10 flex items-center gap-5 shadow-lg group hover:border-white/20 transition-all">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
            <AlertCircle className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest text-rose-400/60">Overdue Tasks</p>
            <p className="text-2xl font-bold text-white mt-1">{overdueCount}</p>
          </div>
        </div>

        <div className="glass-card rounded-[1.5rem] p-6 border-white/10 flex items-center gap-5 shadow-lg group hover:border-white/20 transition-all">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
            <Clock className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest text-amber-400/60">Due Soon</p>
            <p className="text-2xl font-bold text-white mt-1">{dueSoonCount}</p>
          </div>
        </div>
      </section>


      <AssetsClient assets={view} />
    </main>
  );
}
