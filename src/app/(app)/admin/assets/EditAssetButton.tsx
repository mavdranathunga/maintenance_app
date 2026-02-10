"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import EditAssetForm from "./EditAssetForm";
import { type Asset } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EditAssetButton({ asset }: { asset: Asset }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
          size="sm"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] border-white/12 bg-[#0b1020]/85 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Asset</DialogTitle>
        </DialogHeader>

        <EditAssetForm asset={asset} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
