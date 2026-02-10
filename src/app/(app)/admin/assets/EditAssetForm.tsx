"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateAsset } from "./actions";
import { type Asset } from "@prisma/client";

const input =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-500/30";

export default function EditAssetForm({
  asset,
  onSuccess,
}: {
  asset: Asset;
  onSuccess?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const res = await updateAsset(formData);

        if (res && "ok" in res && res.ok) {
          toast.success("Asset updated", {
            description: "Changes saved successfully.",
          });
          onSuccess?.();
        } else if (res && "error" in res) {
          toast.error("Update failed", {
            description: res.error.message,
          });
        }
      } catch (e: unknown) {
        toast.error("Update failed", {
          description: e instanceof Error ? e.message : "Something went wrong.",
        });
      }
    });
  };

  const lastDate = new Date(asset.lastMaintenance).toISOString().slice(0, 10);

  return (
    <form action={onSubmit} className="space-y-4">
      {/* REQUIRED for update */}
      <input type="hidden" name="id" value={asset.id} />

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Asset ID</label>
          <input className={`${input} opacity-70 cursor-not-allowed`} name="assetId" defaultValue={asset.assetId} readOnly />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Assert Name</label>
          <input className={input} name="name" defaultValue={asset.name} required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Category</label>
          <input className={input} name="category" defaultValue={asset.category} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Location</label>
          <input className={input} name="location" defaultValue={asset.location ?? ""} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Next Maintenance Date</label>
          <input className={`${input} opacity-70 cursor-not-allowed`} type="date" name="lastMaintenance" defaultValue={lastDate} readOnly />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Frequency (Days)</label>
          <input className={input} type="number" name="frequencyDays" defaultValue={asset.frequencyDays} required />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs text-white/50 font-medium">Assigned To (email)</label>
          <input className={`${input} md:col-span-2`} name="assignedTo" defaultValue={asset.assignedTo ?? ""} />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs text-white/50 font-medium">Remarks</label>
          <textarea className={`${input} md:col-span-2`} name="notes" defaultValue={asset.notes ?? ""} rows={3} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button disabled={pending} className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/12">
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
