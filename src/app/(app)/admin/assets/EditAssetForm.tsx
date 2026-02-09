"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateAsset } from "./actions";

const input =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-purple-500/30";

export default function EditAssetForm({
  asset,
  onSuccess,
}: {
  asset: any;
  onSuccess?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateAsset(formData);

        toast.success("Asset updated", {
          description: "Changes saved successfully.",
        });

        onSuccess?.();
      } catch (e: any) {
        toast.error("Update failed", {
          description: e?.message ?? "Something went wrong.",
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
        <input className={`${input} opacity-70 cursor-not-allowed`} name="assetId" defaultValue={asset.assetId} readOnly />
        <input className={input} name="name" defaultValue={asset.name} required />

        <input className={input} name="category" defaultValue={asset.category} required />
        <input className={input} name="location" defaultValue={asset.location ?? ""} />

        <input className={`${input} opacity-70 cursor-not-allowed`} type="date" name="lastMaintenance" defaultValue={lastDate} readOnly />
        <input className={input} type="number" name="frequencyDays" defaultValue={asset.frequencyDays} required />

        <input className={`${input} md:col-span-2`} name="assignedTo" defaultValue={asset.assignedTo ?? ""} />
        <textarea className={`${input} md:col-span-2`} name="notes" defaultValue={asset.notes ?? ""} rows={3} />
      </div>

      <div className="flex justify-end pt-2">
        <Button disabled={pending} className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/12">
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
