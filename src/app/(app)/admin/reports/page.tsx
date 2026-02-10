import { requireAdmin } from "@/lib/guards";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, Folder, BarChart3, ShieldCheck } from "lucide-react";
import ReportForm from "./report-form";

export default async function ReportsPage() {
  await requireAdmin();

  return (
    <main className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Branded Reports Header */}
      <header className="relative overflow-hidden rounded-[2rem] glass-strong shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-white/10 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -ml-32 -mb-32" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-white/15 shadow-xl backdrop-blur-md">
              <BarChart3 className="h-8 w-8 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400/80 uppercase">Analytics Core</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white/95 mt-0.5">Intelligence Reports</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a className="flex items-center gap-2.5 rounded-2xl glass-hover bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all" href="/admin/records">
              <Folder className="h-4 w-4 text-amber-400" />
              Records
            </a>
            <a
              className="flex items-center gap-2.5 rounded-2xl glass-hover bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all"
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4 text-white/40" />
              Dashboard
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="glass-card rounded-[2rem] p-8 border-white/10 shadow-2xl">
        <ReportForm />
      </section>
    </main>
  );
}
