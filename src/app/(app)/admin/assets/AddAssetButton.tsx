"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { createAsset } from "./actions";

const input =
  "rounded-xl glass px-3 py-2 text-sm text-white placeholder:text-white/40 bg-transparent outline-none focus:ring-2 focus:ring-purple-500/30";

export default function AddAssetButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl glass glass-hover px-4 py-2 text-sm transition"
      >
        + Add Asset
      </button>

      <Modal open={open} title="Add Asset" onClose={() => setOpen(false)}>
        <form
          action={async (fd) => {
            await createAsset(fd);
            setOpen(false);
          }}
          className="grid gap-3 md:grid-cols-2"
        >
          <input className={input} name="assetId" placeholder="Asset ID (unique)" required />
          <input className={input} name="name" placeholder="Asset Name" required />

          <input className={input} name="category" placeholder="Category (Server/UPS/...)" required />
          <input className={input} name="location" placeholder="Location (optional)" />

          <input className={input} type="date" name="lastMaintenance" required />
          <input className={input} type="number" name="frequencyDays" placeholder="Frequency days (e.g., 30)" required />

          <input className={`${input} md:col-span-2`} name="assignedTo" placeholder="Assigned To (email)" />
          <textarea className={`${input} md:col-span-2`} name="notes" placeholder="Notes (optional)" rows={3} />

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl glass px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="rounded-xl glass glass-hover px-4 py-2">
              Add
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
