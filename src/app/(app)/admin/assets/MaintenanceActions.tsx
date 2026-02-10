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
  "w-full rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-500/30";

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
            className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
            size="sm"
          >
            Complete
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[640px] border-white/12 bg-[#0b1020]/85 text-white backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Mark Maintenance Completed</DialogTitle>
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

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenComplete(false)}
                className="rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={pendingComplete}
                className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/12"
              >
                {pendingComplete ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* RESCHEDULE */}
      <Dialog open={openReschedule} onOpenChange={setOpenReschedule}>
        <DialogTrigger asChild>
          <Button
            className="rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
            size="sm"
          >
            Reschedule
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[640px] border-white/12 bg-[#0b1020]/85 text-white backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Reschedule Maintenance</DialogTitle>
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

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenReschedule(false)}
                className="rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={pendingReschedule}
                className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/12"
              >
                {pendingReschedule ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
