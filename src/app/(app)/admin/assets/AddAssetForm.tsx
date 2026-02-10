"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createAsset } from "./actions";

const input =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all font-sans shadow-inner";

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
      } catch (e: unknown) {
        toast.error("Create failed", {
          description: e instanceof Error ? e.message : "Please check inputs and try again.",
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

      <div className="flex justify-end pt-4">
        <Button disabled={pending} className="rounded-2xl bg-white text-black hover:bg-white/90 px-8 py-6 h-auto font-bold shadow-xl border-none">
          {pending ? "SYNCHRONIZING..." : "REGISTER ASSET"}
        </Button>
      </div>
    </form>
  );
}
