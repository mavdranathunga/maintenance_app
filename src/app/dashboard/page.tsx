import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import AssetsClient from "./AssetsClient";
import LogoutButton from "@/components/LogoutButton";


const DUE_SOON_WINDOW = 14;

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");

  const role = (session.user as any)?.role;

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

  return (
    <main className="p-6 space-y-6">
      <header className="rounded-2xl glass-strong shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Maintenance Dashboard</h1>
          <p className="text-sm text-white/70">
            {session.user?.email} • Role: {role}
          </p>
        </div>
        
        <div className="flex gap-2">
          {role === "ADMIN" && (
            <a className="rounded-xl glass glass-hover px-4 py-2 transition" href="/admin/assets">
              Manage Assets
            </a>
          )}
          <LogoutButton />
        </div>
      </header>


      <AssetsClient assets={view} />
    </main>
  );
}
