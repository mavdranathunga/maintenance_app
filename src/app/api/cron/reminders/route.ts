import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import { sendReminderEmail } from "@/lib/email";

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const dueSoonWindow = Number(process.env.DUE_SOON_WINDOW_DAYS || "14");

  const assets = await prisma.asset.findMany();

  const due = assets
    .map((a) => {
      const nextDue = computeNextDue(a.lastMaintenance, a.frequencyDays);
      const status = computeStatus(nextDue, dueSoonWindow);
      return { a, nextDue, status };
    })
    .filter((x) => x.status === "DUE_SOON" || x.status === "OVERDUE")
    .filter((x) => !!x.a.assignedTo); // must have recipient

  let sent = 0;
  const errors: Array<{ assetId: string; error: string }> = [];

  for (const item of due) {
    try {
      const to = item.a.assignedTo!;
      const subject =
        item.status === "OVERDUE"
          ? `OVERDUE: ${item.a.name} (${item.a.assetId})`
          : `Due Soon: ${item.a.name} (${item.a.assetId})`;

      const html = `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
          <h2>${subject}</h2>
          <p><b>Asset:</b> ${item.a.name} (${item.a.assetId})</p>
          <p><b>Category:</b> ${item.a.category}</p>
          <p><b>Location:</b> ${item.a.location ?? "-"}</p>
          <p><b>Last Maintenance:</b> ${item.a.lastMaintenance.toISOString().slice(0,10)}</p>
          <p><b>Frequency:</b> ${item.a.frequencyDays} days</p>
          <p><b>Next Due:</b> ${item.nextDue.toISOString().slice(0,10)}</p>
          <p><b>Status:</b> ${item.status === "OVERDUE" ? "Overdue" : "Due Soon"}</p>
          ${item.a.notes ? `<p><b>Notes:</b> ${item.a.notes}</p>` : ""}
        </div>
      `;

      await sendReminderEmail({ to, subject, html });
      sent++;
    } catch (e: any) {
      errors.push({ assetId: item.a.assetId, error: e?.message || "unknown" });
    }
  }

  return NextResponse.json({
    ok: true,
    candidates: assets.length,
    dueCount: due.length,
    sent,
    errors,
  });
}
