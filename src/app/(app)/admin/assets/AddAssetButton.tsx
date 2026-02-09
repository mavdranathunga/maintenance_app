"use client";

import { useState } from "react";
import AddAssetForm from "./AddAssetForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddAssetButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/12">
          <PlusCircle className="h-4 w-4 text-yellow-600" />
          Add Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] border-white/12 bg-[#0b1020]/85 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Asset</DialogTitle>
        </DialogHeader>

        <AddAssetForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
