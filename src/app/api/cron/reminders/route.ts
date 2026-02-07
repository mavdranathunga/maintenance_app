import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import { sendReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic"; // avoid any caching weirdness

export async function GET(req: Request) {
  const cronHeader = req.headers.get("x-vercel-cron");
  const ua = req.headers.get("user-agent") || "";
  const secret = new URL(req.url).searchParams.get("secret");
  const okSecret = secret && secret === process.env.CRON_SECRET;

  // ✅ Accept vercel cron in multiple forms
  const isVercelCron =
    req.headers.has("x-vercel-cron") ||           // header present (any value)
    cronHeader === "1" ||                         // common value
    ua.startsWith("vercel-cron");                 // fallback (Vercel Cron UA)

  if (!isVercelCron && !okSecret) {
    // ✅ return safe debug info (no secrets leaked)
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
        debug: {
          hasXVerceCron: req.headers.has("x-vercel-cron"),
          xVercelCron: cronHeader,
          userAgent: ua,
        },
      },
      { status: 401 }
    );
  }

  const dueSoonWindow = Number(process.env.DUE_SOON_WINDOW_DAYS || "14");

  const assets = await prisma.asset.findMany();

  const grouped: Record<string, Array<{
    asset: typeof assets[number];
    nextDue: Date;
    status: "DUE_SOON" | "OVERDUE";
  }>> = {};
  
  for (const a of assets) {
    if (!a.assignedTo) continue;
  
    const nextDue = computeNextDue(a.lastMaintenance, a.frequencyDays);
    const status = computeStatus(nextDue, dueSoonWindow);
  
    if (status !== "DUE_SOON" && status !== "OVERDUE") continue;
  
    if (!grouped[a.assignedTo]) grouped[a.assignedTo] = [];
    grouped[a.assignedTo].push({ asset: a, nextDue, status });
  }


  let sent = 0;
  const errors: Array<{ to: string; error: string }> = [];
  
  for (const [email, items] of Object.entries(grouped)) {
    try {
      const subject =
        items.some(i => i.status === "OVERDUE")
          ? "Maintenance Alert: Overdue Assets"
          : "Maintenance Reminder: Upcoming Assets";
  
      const rows = items.map(i => `
        <tr>
          <td>${i.asset.name}</td>
          <td>${i.asset.assetId}</td>
          <td>${i.asset.category}</td>
          <td>${i.nextDue.toISOString().slice(0,10)}</td>
          <td>${i.status === "OVERDUE" ? "Overdue" : "Due Soon"}</td>
        </tr>
      `).join("");
  
      const html = `
        <div style="font-family: system-ui, sans-serif">
          <h2>${subject}</h2>
          <p>The following assets need maintenance attention:</p>
  
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse">
            <thead>
              <tr>
                <th>Asset</th>
                <th>ID</th>
                <th>Category</th>
                <th>Next Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
  
          <p style="margin-top:12px">
            Please schedule maintenance accordingly.
          </p>
        </div>
      `;
  
      await sendReminderEmail({
        to: email,
        subject,
        html,
      });
  
      sent++;
    } catch (e: any) {
      errors.push({ to: email, error: e?.message || "unknown" });
    }
  }

  

  return NextResponse.json({
    ok: true,
    recipients: Object.keys(grouped).length,
    emailsSent: sent,
    errors,
  });

}
