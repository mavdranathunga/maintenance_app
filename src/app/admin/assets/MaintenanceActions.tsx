"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { completeMaintenance, rescheduleMaintenance } from "./actions";

const input =
  "rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-500/30";

export default function MaintenanceActions({ assetId }: { assetId: string }) {
  const [openComplete, setOpenComplete] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <button
        onClick={() => setOpenComplete(true)}
        className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-400/20 transition"
      >
        Complete
      </button>

      <button
        onClick={() => setOpenReschedule(true)}
        className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200 hover:bg-amber-400/20 transition"
      >
        Reschedule
      </button>

      <Modal open={openComplete} title="Mark Maintenance Completed" onClose={() => setOpenComplete(false)}>
        <form
          action={async (fd) => {
            await completeMaintenance(fd);
            setOpenComplete(false);
          }}
          className="grid gap-3"
        >
          <input type="hidden" name="assetId" value={assetId} />

          <label className="text-sm text-white/70">Completed date</label>
          <input className={input} type="date" name="performedAt" defaultValue={today} required />

          <label className="text-sm text-white/70">Remark (optional)</label>
          <textarea className={input} name="remark" rows={3} placeholder="What was done? Any parts replaced?" />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpenComplete(false)} className="rounded-xl glass px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="rounded-xl glass glass-hover px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={openReschedule} title="Reschedule Maintenance" onClose={() => setOpenReschedule(false)}>
        <form
          action={async (fd) => {
            await rescheduleMaintenance(fd);
            setOpenReschedule(false);
          }}
          className="grid gap-3"
        >
          <input type="hidden" name="assetId" value={assetId} />

          <label className="text-sm text-white/70">New scheduled date</label>
          <input className={input} type="date" name="scheduledFor" required />

          <label className="text-sm text-white/70">Remark</label>
          <textarea className={input} name="remark" rows={3} placeholder="Why rescheduled? New plan?" />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpenReschedule(false)} className="rounded-xl glass px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="rounded-xl glass glass-hover px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
