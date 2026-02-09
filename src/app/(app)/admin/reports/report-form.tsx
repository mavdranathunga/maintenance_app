"use client";

import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { FileText, FileSpreadsheet } from "lucide-react";
import { AlertTriangle, ClipboardList, BarChart3, FileDown } from "lucide-react";

export default function ReportForm() {
  const [report] = useState("status"); // status | completed_monthly | records
  const [format] = useState("pdf"); // pdf | xlsx
  const [from] = useState("");
  const [to] = useState("");

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
          <Select defaultValue="snapshot">
            <SelectTrigger className="w-full h-10 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white backdrop-blur-xl focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20">
              <SelectValue placeholder="Select report" />
            </SelectTrigger>

            <SelectContent className="border border-white/12 bg-[#0b1020]/90 backdrop-blur-xl text-white shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
              <SelectItem value="snapshot" className="focus:bg-white/10 focus:text-white">
                
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Overdue / Due Soon snapshot</span>
                </div>
              </SelectItem>
              <SelectItem value="records" className="focus:bg-white/10 focus:text-white">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-cyan-400" />
                  <span>Maintenance Records</span>
                </div>
              </SelectItem>
              <SelectItem value="completed" className="focus:bg-white/10 focus:text-white">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  <span>Completed per Month</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
    
        {/* Format */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/70">
            Format
          </label>
          <Select defaultValue="pdf">
            <SelectTrigger className="w-full h-10 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white backdrop-blur-xl focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20">
              <SelectValue placeholder="Format" />
            </SelectTrigger>

            <SelectContent className="border border-white/12 bg-[#0b1020]/90 backdrop-blur-xl text-white shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
              <SelectItem value="pdf" className="focus:bg-white/10 focus:text-white">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-rose-400" />
                  <span>PDF</span>
                </div>
              </SelectItem>
              <SelectItem value="excel" className="focus:bg-white/10 focus:text-white">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  <span>Excel</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
          className="flex items-center gap-2 rounded-xl glass glass-hover px-4 py-2 text-sm transition"
          href={url}
        >
          <FileDown className="h-4 w-4 text-blue-400" />
          Generate Report
        </a>
      </div>
    </section>
  );
}
