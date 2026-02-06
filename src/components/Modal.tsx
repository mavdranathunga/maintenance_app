"use client";

import { ReactNode, useEffect } from "react";

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* darker overlay */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-xl rounded-2xl glass-strong p-5 shadow-[0_20px_100px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg glass glass-hover px-3 py-1 text-sm"
          >
            ✕
          </button>
        </div>

        {/* scroll area */}
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
