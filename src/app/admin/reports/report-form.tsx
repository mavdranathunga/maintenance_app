"use client";

import { useMemo, useState } from "react";

const input =
  "rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-500/30";

export default function ReportForm() {
  const [report, setReport] = useState("status"); // status | completed_monthly | records
  const [format, setFormat] = useState("pdf"); // pdf | xlsx
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const url = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("format", format);
    if (from) sp.set("from", from);
    if (to) sp.set("to", to);
    return `/api/reports/${report}?${sp.toString()}`;
  }, [report, format, from, to]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm text-white/70">Report</label>
        <select className={input} value={report} onChange={(e) => setReport(e.target.value)}>
          <option value="status">Overdue / Due Soon snapshot</option>
          <option value="completed_monthly">Completed per month</option>
          <option value="records">Maintenance records (detailed)</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-white/70">Format</label>
        <select className={input} value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="xlsx">Excel (.xlsx)</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-white/70">From (optional)</label>
        <input className={input} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>

      <div>
        <label className="text-sm text-white/70">To (optional)</label>
        <input className={input} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <a
          className="rounded-xl glass glass-hover px-4 py-2 text-sm transition"
          href={url}
        >
          Generate & Download
        </a>
      </div>
    </div>
  );
}
