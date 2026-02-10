"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAsset } from "./actions";

export default function DeleteAssetDialog({
  assetId,
  label,
}: {
  assetId: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("id", assetId);

        await deleteAsset(fd);

        toast.success("Asset deleted", {
          description: `${label} was removed.`,
        });
      } catch (e: any) {
        toast.error("Delete failed", {
          description: e?.message ?? "Something went wrong.",
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          className="rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-100 text-xs"
          size="sm"
        >  
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#0b1020]/90 backdrop-blur-xl border border-white/12 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this asset?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            This action cannot be undone. This will permanently remove <b>{label}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onDelete}
            disabled={pending}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
          >
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
