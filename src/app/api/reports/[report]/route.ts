import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeNextDue, computeStatus } from "@/lib/maintenance";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import path from "path";


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
  const { from, to, format } = parseRange(req.url);

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
      : statusPdf(rows);
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
      : recordsPdf(records);
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
      : completedMonthlyPdf(rows);
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
  return new NextResponse(Buffer.from(buf), {
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
  return new NextResponse(Buffer.from(buf), {
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
  return new NextResponse(Buffer.from(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="completed-per-month.xlsx"`,
    },
  });
}

/* ---------------- PDF generators ---------------- */

function statusPdf(rows: any[]) {
  const doc = new PDFDocument({
    margin: 36,
    autoFirstPage: true
  });

  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Roboto-Regular.ttf"
  );

  doc.registerFont("Roboto", fontPath);
  doc.font("Roboto");

  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  doc.fontSize(16).text("Overdue / Due Soon Snapshot", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Generated: ${new Date().toISOString().slice(0, 10)}`);
  doc.moveDown();

  rows
    .filter((r) => r.status !== "OK")
    .forEach((r) => {
      doc.fontSize(11).text(`${r.status} • ${r.name} (${r.assetId})`);
      doc.fontSize(9).fillColor("gray").text(`Next Due: ${r.nextDue} • Category: ${r.category} • Assigned: ${r.assignedTo || "-"}`);
      doc.fillColor("white").moveDown(0.6);
    });

  doc.end();

  return done.then((buf) =>
    new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="status-report.pdf"`,
      },
    })
  );
}

function recordsPdf(records: any[]) {
  const doc = new PDFDocument({
    margin: 36,
    autoFirstPage: true
  });

  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Roboto-Regular.ttf"
  );

  doc.registerFont("Roboto", fontPath);
  doc.font("Roboto");

  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  doc.fontSize(16).text("Maintenance Records", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Generated: ${new Date().toISOString().slice(0, 10)}`);
  doc.moveDown();

  records.slice(0, 300).forEach((r) => {
    doc.fontSize(11).text(`${r.performedAt.toISOString().slice(0, 10)} • ${r.action}`);
    doc.fontSize(9).fillColor("gray").text(
      `${r.asset.assetId} • ${r.asset.name} • Updated by: ${r.updatedByEmail ?? "-"}`
    );
    if (r.scheduledFor) doc.text(`Scheduled For: ${r.scheduledFor.toISOString().slice(0, 10)}`);
    if (r.remark) doc.text(`Remark: ${r.remark}`);
    doc.fillColor("white").moveDown(0.6);
  });

  doc.end();

  return done.then((buf) =>
    new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="maintenance-records.pdf"`,
      },
    })
  );
}

function completedMonthlyPdf(rows: { month: string; count: number }[]) {
  const doc = new PDFDocument({ margin: 36 });

  const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
  doc.font(fontPath);

  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  doc.fontSize(16).text("Completed Maintenance per Month", { underline: true });
  doc.moveDown();

  rows.forEach((r) => doc.fontSize(12).text(`${r.month}: ${r.count}`));

  doc.end();

  return done.then((buf) =>
    new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="completed-per-month.pdf"`,
      },
    })
  );
}
