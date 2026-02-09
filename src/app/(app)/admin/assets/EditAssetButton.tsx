"use client";

import { useState } from "react";
import EditAssetForm from "./EditAssetForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EditAssetButton({ asset }: { asset: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white text-xs">
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
