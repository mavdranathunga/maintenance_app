import { requireAdmin } from "@/lib/guards";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, Folder  } from "lucide-react";

export default async function ReportsPage() {
  await requireAdmin();

  return (
    <main className="space-y-6">
      <header className="rounded-2xl glass-strong p-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reports
          </h1>
          <p className="text-sm text-white/70">Generate PDF or Excel reports</p>
        </div>
        <div className="flex items-center gap-2">
          <a className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-2 text-sm transition" href="/admin/records">
            <Folder className="h-4 w-4 text-amber-400" />
            Records
          </a>
          <a href="/dashboard" className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-2 text-sm transition"><LayoutDashboard className="h-4 w-4 text-purple-400" />Dashboard</a>
          <LogoutButton />
        </div>
      </header>

      <section className="rounded-2xl glass-strong p-5">
        <ReportForm />
      </section>
    </main>
  );
}

// client form
import ReportForm from "./report-form";
