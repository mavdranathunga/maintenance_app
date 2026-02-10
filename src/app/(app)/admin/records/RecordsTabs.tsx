"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Wrench, ShieldAlert } from "lucide-react";

interface RecordsTabsProps {
    maintenanceTable: React.ReactNode;
    auditTable: React.ReactNode;
    maintenanceCount: number;
    auditCount: number;
}

export default function RecordsTabs({
    maintenanceTable,
    auditTable,
    maintenanceCount,
    auditCount
}: RecordsTabsProps) {
    const [activeTab, setActiveTab] = useState<"maintenance" | "audit">("maintenance");

    return (
        <div className="space-y-8">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-2xl w-fit backdrop-blur-3xl shadow-2xl">
                <button
                    onClick={() => setActiveTab("maintenance")}
                    className={cn(
                        "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300",
                        activeTab === "maintenance"
                            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                            : "text-white/30 hover:text-white/60 hover:bg-white/5"
                    )}
                >
                    <Wrench size={14} className={activeTab === "maintenance" ? "text-amber-400" : "text-white/20"} />
                    Maintenance Execution
                    <span className="ml-1 text-[10px] font-black opacity-30">({maintenanceCount})</span>
                </button>

                <button
                    onClick={() => setActiveTab("audit")}
                    className={cn(
                        "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300",
                        activeTab === "audit"
                            ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                            : "text-white/30 hover:text-white/60 hover:bg-white/5"
                    )}
                >
                    <ShieldAlert size={14} className={activeTab === "audit" ? "text-blue-400" : "text-white/20"} />
                    System Audit
                    <span className="ml-1 text-[10px] font-black opacity-30">({auditCount})</span>
                </button>
            </div>

            {/* Registry Display */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "maintenance" ? maintenanceTable : auditTable}
            </div>
        </div>
    );
}
