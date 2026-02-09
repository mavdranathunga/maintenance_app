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
    <section>
      {/* Controls */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/70">
            Report Type
          </label>
          <select className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20">
            <option>Overdue / Due Soon snapshot</option>
            <option>Maintenance Records</option>
            <option>Completed per Month</option>
          </select>
        </div>
    
        {/* Format */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/70">
            Format
          </label>
          <select className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20">
            <option>PDF</option>
            <option>Excel</option>
          </select>
        </div>
      </div>
    
      {/* Date Range */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-white/70">
          Date Range (optional)
        </label>
    
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-center">
          <input
            type="date"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          />
    
          <span className="hidden md:block text-white/40 text-sm">
            —
          </span>
    
          <input
            type="date"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>
      </div>
    
      {/* Action */}
      <div className="mt-8 flex justify-end">
        <a
          className="rounded-xl glass glass-hover px-4 py-2 text-sm transition"
          href={url}
        >
          Generate Report
        </a>
      </div>
    </section>
  );
}
