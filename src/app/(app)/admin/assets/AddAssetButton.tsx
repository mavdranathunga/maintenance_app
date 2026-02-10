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
        <button className="flex items-center gap-2.5 rounded-2xl glass-hover bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] group">
          <PlusCircle className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
          <span className="text-white/90 group-hover:text-white">Add Asset</span>
        </button>
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
