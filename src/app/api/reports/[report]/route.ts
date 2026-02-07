import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import ExcelJS from "exceljs";
import { createPdfDoc, drawHeader, drawTable, drawFooters } from "@/lib/pdfReport";
import { auth } from "@/auth";



export const runtime = "nodejs"; // important for pdfkit/exceljs

function parseRange(url: string) {
  const u = new URL(url);
  const from = u.searchParams.get("from");
  const to = u.searchParams.get("to");
  const format = (u.searchParams.get("format") || "pdf").toLowerCase();
  return { from, to, format };
}

function dateOrNull(s: string | null) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET( req: Request, ctx: { params: Promise<{ report: string }> } ) {
  const { report } = await ctx.params;

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const preparedBy = session.user.email;


  const { from, to, format } = parseRange(req.url);

  const rangeLabel =
  from && to ? `Period: ${from} to ${to}` : from ? `From: ${from}` : to ? `To: ${to}` : "Period: All time";


  const fromD = dateOrNull(from);
  const toD = dateOrNull(to);

  if (format !== "pdf" && format !== "xlsx") {
    return NextResponse.json({ ok: false, error: "format must be pdf or xlsx" }, { status: 400 });
  }

  if (report === "status") {
    const assets = await prisma.asset.findMany();

    const dueSoonWindow = Number(process.env.DUE_SOON_WINDOW_DAYS || "14");
    const rows = assets.map((a) => {
      const nextDue = computeNextDue(a.lastMaintenance, a.frequencyDays);
      const status = computeStatus(nextDue, dueSoonWindow);
      return {
        assetId: a.assetId,
        name: a.name,
        category: a.category,
        location: a.location ?? "",
        nextDue: nextDue.toISOString().slice(0, 10),
        status,
        assignedTo: a.assignedTo ?? "",
      };
    });

    return format === "xlsx"
  ? statusExcel(rows)
  : statusPdf(rows, rangeLabel, preparedBy);

  }

  if (report === "records") {
    const where: any = {};
    if (fromD || toD) {
      where.performedAt = {};
      if (fromD) where.performedAt.gte = fromD;
      if (toD) where.performedAt.lte = toD;
    }

    const records = await prisma.maintenanceRecord.findMany({
      where,
      orderBy: { performedAt: "desc" },
      include: { asset: true },
      take: 5000,
    });

    return format === "xlsx"
      ? recordsExcel(records)
      : recordsPdf(records, rangeLabel, preparedBy);
  }

  if (report === "completed_monthly") {
    // Simple approach: pull completed records and group in JS
    const where: any = { action: "COMPLETED" };
    if (fromD || toD) {
      where.performedAt = {};
      if (fromD) where.performedAt.gte = fromD;
      if (toD) where.performedAt.lte = toD;
    }

    const completed = await prisma.maintenanceRecord.findMany({
      where,
      orderBy: { performedAt: "asc" },
      take: 20000,
    });

    const map = new Map<string, number>();
    for (const r of completed) {
      const key = r.performedAt.toISOString().slice(0, 7); // YYYY-MM
      map.set(key, (map.get(key) || 0) + 1);
    }

    const rows = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    return format === "xlsx"
      ? completedMonthlyExcel(rows)
      : completedMonthlyPdf(rows, rangeLabel, preparedBy);
  }

  return NextResponse.json({ ok: false, error: "Unknown report" }, { status: 404 });
}

/* ---------------- Excel generators ---------------- */

async function statusExcel(rows: any[]) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Status");
  ws.addRow(["Asset ID", "Name", "Category", "Location", "Next Due", "Status", "Assigned To"]);
  rows.forEach((r) => ws.addRow([r.assetId, r.name, r.category, r.location, r.nextDue, r.status, r.assignedTo]));
  ws.columns.forEach((c) => (c.width = 18));

  const buf = await wb.xlsx.writeBuffer();
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="status-report.xlsx"`,
    },
  });
}

async function recordsExcel(records: any[]) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Records");
  ws.addRow(["Date", "Action", "Asset ID", "Asset Name", "Scheduled For", "Remark", "Updated By"]);
  records.forEach((r) =>
    ws.addRow([
      r.performedAt.toISOString().slice(0, 10),
      r.action,
      r.asset.assetId,
      r.asset.name,
      r.scheduledFor ? r.scheduledFor.toISOString().slice(0, 10) : "",
      r.remark ?? "",
      r.updatedByEmail ?? "",
    ])
  );
  ws.columns.forEach((c) => (c.width = 18));

  const buf = await wb.xlsx.writeBuffer();
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="maintenance-records.xlsx"`,
    },
  });
}

async function completedMonthlyExcel(rows: { month: string; count: number }[]) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Completed Monthly");
  ws.addRow(["Month", "Completed Count"]);
  rows.forEach((r) => ws.addRow([r.month, r.count]));
  ws.columns.forEach((c) => (c.width = 22));

  const buf = await wb.xlsx.writeBuffer();
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="completed-per-month.xlsx"`,
    },
  });
}







/* ---------------- PDF generators ---------------- */

function statusPdf(rows: any[], rangeLabel: string, preparedBy: string) {
  const doc = createPdfDoc();
  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  drawHeader(doc, {
    title: "Maintenance Status Report",
    subtitle: "Overdue / Due Soon",
    dateRange: rangeLabel,
    reportId: `STAT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`,
    preparedBy,
  });

  const filtered = rows.filter((r) => r.status !== "OK");

  drawTable(
    doc,
    [
      { header: "Asset", width: 90 },
      { header: "Category", width: 80 },
      { header: "Next Due", width: 90 },
      { header: "Status", width: 80 },
      { header: "Assigned To", width: 170 },
    ],
    filtered.map((r) => [
      `${r.name} (${r.assetId})`,
      r.category,
      r.nextDue,
      r.status === "DUE_SOON" ? "Due Soon" : "Overdue",
      r.assignedTo || "-",
    ])
  );

  drawFooters(doc);
  doc.end();

  return done.then(
    (buf) =>
      new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="status-report.pdf"`,
        },
      })
  );
}









function recordsPdf(records: any[], rangeLabel: string, preparedBy: string) {
  const doc = createPdfDoc();
  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  drawHeader(doc, {
    title: "Maintenance Records Report",
    subtitle: "Completed / Rescheduled History",
    dateRange: rangeLabel,
    reportId: `REC-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`,
    preparedBy,
  });

  drawTable(
    doc,
    [
      { header: "Date", width: 60 },
      { header: "Action", width: 90 },
      { header: "Asset", width: 80 },
      { header: "Scheduled", width: 60 },
      { header: "Updated By", width: 160 },
      { header: "Remarks", width: 160 },
    ],
    records.map((r: any) => [
      r.performedAt.toISOString().slice(0, 10),
      r.action,
      `${r.asset.name} (${r.asset.assetId})`,
      r.scheduledFor ? r.scheduledFor.toISOString().slice(0, 10) : "-",
      r.updatedByEmail || "-",
    ])
  );

  // Remarks section (optional but corporate)
  // If you want remarks inside table, we need multi-line rows. Safer: put remarks as a bullet list.
  const withRemark = records.filter((r: any) => r.remark && String(r.remark).trim().length);
  if (withRemark.length) {
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a").text("Remarks (latest)");
    doc.moveDown(0.3);

    doc.font("Helvetica").fontSize(9).fillColor("#0f172a");
    withRemark.slice(0, 12).forEach((r: any) => {
      doc.text(
        `• ${r.performedAt.toISOString().slice(0, 10)} ${r.asset.assetId}: ${String(r.remark).slice(0, 140)}`,
        { lineGap: 2 }
      );
    });
  }

  drawFooters(doc);
  doc.end();

  return done.then(
    (buf) =>
      new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="maintenance-records.pdf"`,
        },
      })
  );
}










function completedMonthlyPdf(rows: { month: string; count: number }[], rangeLabel: string, preparedBy: string) {
  const doc = createPdfDoc();
  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  drawHeader(doc, {
    title: "Completed Maintenance Report",
    subtitle: "Completed per Month",
    dateRange: rangeLabel,
    reportId: `CMP-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`,
    preparedBy,
  });

  const total = rows.reduce((sum, r) => sum + r.count, 0);

  // Summary line
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a").text(`Total Completed: ${total}`);
  doc.moveDown(0.6);

  drawTable(
    doc,
    [
      { header: "Month", width: 220 },
      { header: "Completed Count", width: 200 },
    ],
    rows.map((r) => [r.month, String(r.count)])
  );

  drawFooters(doc);
  doc.end();

  return done.then(
    (buf) =>
      new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="completed-per-month.pdf"`,
        },
      })
  );
}

