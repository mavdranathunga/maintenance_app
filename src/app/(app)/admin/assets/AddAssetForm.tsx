"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createAsset } from "./actions";

const input =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-500/30";

export default function AddAssetForm({ onSuccess }: { onSuccess?: () => void }) {
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const res = await createAsset(formData);

        if (res && "ok" in res && res.ok) {
          toast.success("Asset created", {
            description: "The asset was added successfully.",
          });
          onSuccess?.();
        } else if (res && "error" in res) {
          toast.error("Create failed", {
            description: res.error.message,
          });
        }
      } catch (e: any) {
        toast.error("Create failed", {
          description: e?.message ?? "Please check inputs and try again.",
        });
      }
    });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Asset ID</label>
          <input className={input} name="assetId" placeholder="Must be unique" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Assert Name</label>
          <input className={input} name="name" placeholder="Asset Name" required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Category</label>
          <input className={input} name="category" placeholder="Server / UPS / ..." required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Location</label>
          <input className={input} name="location" placeholder="(optional)" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Next Maintenance Date</label>
          <input className={input} type="date" name="lastMaintenance" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 font-medium">Frequency (Days)</label>
          <input className={input} type="number" name="frequencyDays" placeholder="e.g., 30" required />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs text-white/50 font-medium">Assigned To (email)</label>
          <input className={`${input} md:col-span-2`} name="assignedTo" placeholder="someone@company.com" />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs text-white/50 font-medium">Remarks</label>
          <textarea className={`${input} md:col-span-2`} name="notes" placeholder="Anything special..." rows={3} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button disabled={pending} className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/12">
          {pending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
