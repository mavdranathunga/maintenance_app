import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

type HeaderMeta = {
  title: string;
  subtitle?: string;
  dateRange?: string;
  reportId?: string;
  preparedBy?: string;
};

function safeEnv(key: string, fallback = "") {
  const v = process.env[key];
  return v && v.trim().length ? v : fallback;
}

export function createPdfDoc() {
  return new PDFDocument({
    size: "A4",
    margins: { top: 56, bottom: 56, left: 44, right: 44 },
    bufferPages: true, // needed for reliable footers
  });
}

export function drawHeader(doc: PDFKit.PDFDocument, meta: HeaderMeta) {
  const company = safeEnv("COMPANY_NAME", "Company Name");
  const address = safeEnv("COMPANY_ADDRESS", "No. XX, Street, City, Sri Lanka");
  const contact = safeEnv("COMPANY_CONTACT", "maintenance@company.com | +94 xx xxx xxxx");

  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;
  const fullW = right - left;

  // ===== Top band (taller) =====
  const bandH = 68; // was ~54
  doc.save();
  doc.rect(0, 0, doc.page.width, bandH).fill("#0f172a");
  doc.restore();

  // Logo
  const logoPath = path.join(process.cwd(), "public", "company-logo.jpg");
  const logoBox = { x: left, y: 16, w: 100, h: 36 }; // bigger / centered inside taller band

  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, logoBox.x, logoBox.y, { fit: [logoBox.w, logoBox.h] });
    } catch {}
  } else {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#ffffff")
      .text(company, left, 24, { width: 220 });
  }

  // Right company block
  const companyBlockX = left + 240;
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#ffffff")
    .text(company, companyBlockX, 18, { width: right - companyBlockX, align: "right" });

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#cbd5e1")
    .text(address, companyBlockX, 34, { width: right - companyBlockX, align: "right" });

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#cbd5e1")
    .text(contact, companyBlockX, 46, { width: right - companyBlockX, align: "right" });

  // Move below header band
  doc.y = bandH + 24;

  // ===== Report title (LEFT aligned) =====
  doc.font("Helvetica-Bold").fontSize(20).fillColor("#0f172a").text(meta.title, left, doc.y, {
    width: fullW,
    align: "left",
  });

  if (meta.subtitle) {
    doc.font("Helvetica").fontSize(11).fillColor("#334155").text(meta.subtitle, {
      width: fullW,
      align: "left",
    });
  }

  doc.moveDown(0.8);

  // ===== Metadata grid (aligned) =====
  const generated = new Date();
  const generatedAt = `${generated.toISOString().slice(0, 10)} ${generated.toTimeString().slice(0, 5)}`;

  const reportNo =
    meta.reportId || `REP-${generated.toISOString().slice(0, 10).replaceAll("-", "")}`;
  const preparedBy = meta.preparedBy || "-";
  const period = meta.dateRange || "All time";

  const boxY = doc.y;
  const boxH = 62;

  doc.save();
  doc.roundedRect(left, boxY, fullW, boxH, 10).fill("#f1f5f9");
  doc.restore();

  // Layout: 2 columns (left meta / right meta), each has label + value aligned
  const padX = 14;
  const padY = 12;

  const colW = (fullW - padX * 2) / 2;
  const labelW = 92; // fixed label width for alignment
  const valueW = colW - labelW;

  const col1X = left + padX;
  const col2X = left + padX + colW;

  const row1Y = boxY + padY;
  const row2Y = boxY + padY + 24;

  // Row 1: Report No | Prepared By
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a");
  doc.text("Report No", col1X, row1Y, { width: labelW });
  doc.text("Prepared By", col2X, row1Y, { width: labelW });

  doc.font("Helvetica").fontSize(9).fillColor("#334155");
  doc.text(reportNo, col1X + labelW, row1Y, { width: valueW });
  doc.text(preparedBy, col2X + labelW, row1Y, { width: valueW });

  // Row 2: Generated At | Period
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a");
  doc.text("Generated At", col1X, row2Y, { width: labelW });
  doc.text("Period", col2X, row2Y, { width: labelW });

  doc.font("Helvetica").fontSize(9).fillColor("#334155");
  doc.text(generatedAt, col1X + labelW, row2Y, { width: valueW });
  doc.text(period, col2X + labelW, row2Y, { width: valueW });

  // Divider under metadata
  doc
    .moveTo(left, boxY + boxH + 16)
    .lineTo(right, boxY + boxH + 16)
    .lineWidth(1)
    .strokeColor("#e2e8f0")
    .stroke();

  doc.y = boxY + boxH + 28;
}


function wrapText(value: string, maxLen: number) {
  const v = (value || "").trim();
  if (v.length <= maxLen) return v;
  return v.slice(0, maxLen - 1) + "…";
}

// Professional table with zebra rows + safe wrapping
export function drawTable(
  doc: PDFKit.PDFDocument,
  columns: { header: string; width: number; align?: "left" | "right" | "center" }[],
  rows: string[][]
) {
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;

  const headerH = 22;
  const rowH = 20;

  const renderHeader = () => {
    const y = doc.y;

    // header bg
    doc.save();
    doc.rect(left, y, right - left, headerH).fill("#0f172a");
    doc.restore();

    // header text
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#ffffff");
    let x = left;
    columns.forEach((c) => {
      doc.text(c.header, x + 6, y + 6, { width: c.width - 10, align: c.align || "left" });
      x += c.width;
    });

    doc.y = y + headerH;
  };

  const ensureSpace = (needed: number) => {
    const bottom = doc.page.height - doc.page.margins.bottom;
    if (doc.y + needed > bottom) {
      doc.addPage();
      // On new page, re-draw table header
      renderHeader();
    }
  };

  renderHeader();

  doc.font("Helvetica").fontSize(9).fillColor("#0f172a");

  rows.forEach((r, idx) => {
    ensureSpace(rowH + 6);

    const y = doc.y;

    // zebra background
    if (idx % 2 === 1) {
      doc.save();
      doc.rect(left, y, right - left, rowH).fill("#f8fafc");
      doc.restore();
    }

    // row border
    doc.save();
    doc
      .moveTo(left, y + rowH)
      .lineTo(right, y + rowH)
      .lineWidth(0.5)
      .strokeColor("#e2e8f0")
      .stroke();
    doc.restore();

    let x = left;
    for (let i = 0; i < columns.length; i++) {
      const c = columns[i];
      const cell = String(r[i] ?? "");

      // Keep ugly long strings under control (emails)
      const shown =
        c.width <= 90 ? wrapText(cell, 14) : c.width <= 140 ? wrapText(cell, 24) : wrapText(cell, 40);

      doc.text(shown, x + 6, y + 6, { width: c.width - 10, align: c.align || "left" });
      x += c.width;
    }

    doc.y = y + rowH;
  });

  doc.moveDown(0.8);
}

// Draw footer on every page (NO “second page” issue)
export function drawFooters(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();

  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);

    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;

    // Absolute footer area (safe)
    const footerY = doc.page.height - doc.page.margins.bottom + 18; // inside bottom margin

    // divider line
    doc.save();
    doc
      .moveTo(left, footerY - 10)
      .lineTo(right, footerY - 10)
      .lineWidth(0.5)
      .strokeColor("#e2e8f0")
      .stroke();
    doc.restore();

    // IMPORTANT: use absolute positioning + disable line breaks
    doc.save();
    doc.font("Helvetica").fontSize(9).fillColor("#64748b");
    doc.text(`Page ${i + 1} of ${range.count}`, left, footerY, {
      width: right - left,
      align: "right",
      lineBreak: false,
    });
    doc.restore();
  }
}
