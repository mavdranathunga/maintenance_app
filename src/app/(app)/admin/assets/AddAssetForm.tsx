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
        await createAsset(formData);

        toast.success("Asset created", {
          description: "The asset was added successfully.",
        });

        onSuccess?.();
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
        <input className={input} name="assetId" placeholder="Asset ID (unique)" required />
        <input className={input} name="name" placeholder="Asset Name" required />

        <input className={input} name="category" placeholder="Category (Server/UPS/...)" required />
        <input className={input} name="location" placeholder="Location (optional)" />

        <input className={input} type="date" name="lastMaintenance" required />
        <input className={input} type="number" name="frequencyDays" placeholder="Frequency days (e.g., 30)" required />

        <input className={`${input} md:col-span-2`} name="assignedTo" placeholder="Assigned To (email)" />
        <textarea className={`${input} md:col-span-2`} name="notes" placeholder="Notes (optional)" rows={3} />
      </div>

      <div className="flex justify-end pt-2">
        <Button disabled={pending} className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/12">
          {pending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
