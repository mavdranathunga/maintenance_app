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
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("id", id);

        const res = await deleteAsset(fd);

        if (res && "ok" in res && res.ok) {
          toast.success("Asset deleted", {
            description: `${name} was removed.`,
          });
        } else if (res && "error" in res) {
          toast.error("Delete failed", {
            description: res.error.message,
          });
        }
      } catch (e: unknown) {
        toast.error("Delete failed", {
          description: e instanceof Error ? e.message : "Something went wrong.",
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-100 font-bold uppercase tracking-widest text-[10px] px-4"
          size="sm"
        >
          ERASE
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-[2.5rem] bg-[#0b1020]/90 backdrop-blur-3xl border border-white/10 text-white shadow-2xl p-10">
        <AlertDialogHeader className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-rose-400 opacity-80 uppercase tracking-[0.2em]">Destructive Action</span>
          </div>
          <AlertDialogTitle className="text-2xl font-bold tracking-tight">Purge Metadata Registry?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/40 font-medium text-[13px] leading-relaxed pt-2">
            This action cannot be undone. You are about to permanently purge <span className="text-rose-100 font-bold">{name}</span> from the system registry.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 pt-4">
          <AlertDialogCancel className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-bold uppercase tracking-widest text-[10px] px-6 h-12 transition-all">
            ABORT
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onDelete}
            disabled={pending}
            className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-widest text-[10px] px-8 h-12 shadow-xl border-none transition-all active:scale-[0.98]"
          >
            {pending ? "PURGING..." : "CONFIRM PURGE"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
