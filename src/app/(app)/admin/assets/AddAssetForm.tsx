"use client";

import { createAsset } from "./actions";

export default function AddAssetForm() {
  return (
    <form action={createAsset} className="mt-3 grid gap-3 md:grid-cols-2">
      <input className="rounded-xl border p-2" name="assetId" placeholder="Asset ID (unique)" required />
      <input className="rounded-xl border p-2" name="name" placeholder="Asset Name" required />
      <input className="rounded-xl border p-2" name="category" placeholder="Category (Server/UPS/...)" required />
      <input className="rounded-xl border p-2" name="location" placeholder="Location (optional)" />

      <input className="rounded-xl border p-2" type="date" name="lastMaintenance" required />
      <input className="rounded-xl border p-2" type="number" name="frequencyDays" placeholder="Frequency days (e.g., 30)" required />

      <input className="rounded-xl border p-2 md:col-span-2" name="assignedTo" placeholder="Assigned To (email or name)" />
      <textarea className="rounded-xl border p-2 md:col-span-2" name="notes" placeholder="Notes (optional)" rows={3} />

      <button className="rounded-xl border px-4 py-2 md:col-span-2">
        Add Asset
      </button>
    </form>
  );
}
