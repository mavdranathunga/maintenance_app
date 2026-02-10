"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { completeMaintenance, rescheduleMaintenance } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const input =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all font-sans shadow-inner";

export default function MaintenanceActions({ assetId }: { assetId: string }) {
  const [openComplete, setOpenComplete] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);

  const [pendingComplete, startComplete] = useTransition();
  const [pendingReschedule, startReschedule] = useTransition();

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex items-center gap-2">
      {/* COMPLETE */}
      <Dialog open={openComplete} onOpenChange={setOpenComplete}>
        <DialogTrigger asChild>
          <Button
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 font-bold uppercase tracking-widest text-[10px] px-4"
            size="sm"
          >
            RESOLVE
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[640px] border-white/12 bg-[#0b1020]/85 text-white backdrop-blur-xl">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Maintenance Execution</span>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">Log Resolution</DialogTitle>
          </DialogHeader>

          <form
            action={(fd) => {
              startComplete(async () => {
                try {
                  // required hidden field
                  fd.set("assetId", assetId);

                  const res = await completeMaintenance(fd);

                  if (res && "ok" in res && res.ok) {
                    toast.success("Marked as completed", {
                      description: "Maintenance record saved successfully.",
                    });
                    setOpenComplete(false);
                  } else if (res && "error" in res) {
                    toast.error("Failed to complete", {
                      description: res.error.message,
                    });
                    setOpenComplete(false);
                  }
                } catch (e: unknown) {
                  toast.error("Failed to complete", {
                    description: e instanceof Error ? e.message : "Something went wrong.",
                  });
                }
              });
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-sm text-white/70">Completed date</label>
              <input
                className={input}
                type="date"
                name="performedAt"
                defaultValue={today}
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Remark (optional)</label>
              <textarea
                className={input}
                name="remark"
                rows={3}
                placeholder="What was done? Any parts replaced?"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenComplete(false)}
                className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-bold uppercase tracking-widest text-[10px] px-6 h-12 transition-all"
              >
                DISCARD
              </Button>

              <Button
                type="submit"
                disabled={pendingComplete}
                className="rounded-2xl bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-[10px] px-8 h-12 shadow-xl border-none transition-all"
              >
                {pendingComplete ? "PROCESSING..." : "COMMIT LOG"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* RESCHEDULE */}
      <Dialog open={openReschedule} onOpenChange={setOpenReschedule}>
        <DialogTrigger asChild>
          <Button
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-400/20 font-bold uppercase tracking-widest text-[10px] px-4"
            size="sm"
          >
            ADJUST
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[640px] border-white/12 bg-[#0b1020]/85 text-white backdrop-blur-xl">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Deployment Adjustment</span>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">Reschedule Window</DialogTitle>
          </DialogHeader>

          <form
            action={(fd) => {
              startReschedule(async () => {
                try {
                  fd.set("assetId", assetId);

                  const res = await rescheduleMaintenance(fd);

                  if (res && "ok" in res && res.ok) {
                    toast.success("Rescheduled", {
                      description: "Maintenance record saved successfully.",
                    });
                    setOpenReschedule(false);
                  } else if (res && "error" in res) {
                    toast.error("Failed to reschedule", {
                      description: res.error.message,
                    });
                    setOpenReschedule(false);
                  }
                } catch (e: unknown) {
                  toast.error("Failed to reschedule", {
                    description: e instanceof Error ? e.message : "Something went wrong.",
                  });
                }
              });
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-sm text-white/70">New scheduled date</label>
              <input className={input} type="date" name="scheduledFor" required />
            </div>

            <div>
              <label className="text-sm text-white/70">Remark</label>
              <textarea
                className={input}
                name="remark"
                rows={3}
                placeholder="Why rescheduled? New plan?"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenReschedule(false)}
                className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-bold uppercase tracking-widest text-[10px] px-6 h-12 transition-all"
              >
                DISCARD
              </Button>

              <Button
                type="submit"
                disabled={pendingReschedule}
                className="rounded-2xl bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-[10px] px-8 h-12 shadow-xl border-none transition-all"
              >
                {pendingReschedule ? "PROCESSING..." : "UPDATE WINDOW"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
