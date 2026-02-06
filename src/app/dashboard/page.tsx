import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import AssetsClient from "./AssetsClient";

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
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Maintenance Dashboard</h1>
          <p className="text-sm opacity-70">
            Logged in as {session.user?.email} — Role: {role}
          </p>
        </div>

        {role === "ADMIN" && (
          <a className="rounded-xl border px-4 py-2" href="/admin/assets">
            Manage Assets
          </a>
        )}
      </header>

      <AssetsClient assets={view} />
    </main>
  );
}
