"use client";

import { useState } from "react";
import { updateAsset } from "./actions";
import Modal from "@/components/Modal";


export default function EditAssetButton({ asset }: { asset: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg glass glass-hover px-3 py-1 text-xs transition"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl glass-strong p-5">
            <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
            <Modal open={open} title="Edit Asset" onClose={() => setOpen(false)}>
                <form
                  action={async (fd) => {
                    await updateAsset(fd);
                    setOpen(false);
                  }}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <input type="hidden" name="id" value={asset.id} />

                  <input defaultValue={asset.assetId} name="assetId" className="glass px-3 py-2 rounded-xl" />
                  <input defaultValue={asset.name} name="name" className="glass px-3 py-2 rounded-xl" />
                  <input defaultValue={asset.category} name="category" className="glass px-3 py-2 rounded-xl" />
                  <input defaultValue={asset.location ?? ""} name="location" className="glass px-3 py-2 rounded-xl" />

                  <input
                    type="date"
                    defaultValue={asset.lastMaintenance.toISOString().slice(0,10)}
                    name="lastMaintenance"
                    className="glass px-3 py-2 rounded-xl"
                  />

                  <input
                    type="number"
                    defaultValue={asset.frequencyDays}
                    name="frequencyDays"
                    className="glass px-3 py-2 rounded-xl"
                  />

                  <input defaultValue={asset.assignedTo ?? ""} name="assignedTo" className="glass px-3 py-2 rounded-xl md:col-span-2" />
                  <textarea defaultValue={asset.notes ?? ""} name="notes" className="glass px-3 py-2 rounded-xl md:col-span-2" rows={3} />

                  <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-xl glass px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl glass glass-hover px-4 py-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
}
