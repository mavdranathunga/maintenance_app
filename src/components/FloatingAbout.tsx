"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

export default function AboutFloating() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Info Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full
                   backdrop-blur-md bg-white/10 border border-white/20
                   hover:bg-white/20 transition-all duration-200 shadow-lg"
      >
        {open ? <X size={18} /> : <Info size={18} />}
      </button>

      {/* Glass Popup */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-80
                        backdrop-blur-xl bg-white/10
                        border border-white/20
                        rounded-2xl shadow-2xl
                        p-5 text-sm text-white
                        animate-in fade-in slide-in-from-bottom-2 duration-200">

          <h3 className="text-base font-semibold mb-3">
            Maintenance Management System
          </h3>

          <div className="space-y-1 text-white/80">
            <p>Version 1.0.0</p>
            <p>Developed by <span className="text-white font-medium">Deshan Ranathunga</span></p>
            <p>Computer Systems Engineering</p>
            <p>Built with Next.js, Prisma, PostgreSQL</p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/50">
            © 2026
          </div>
        </div>
      )}
    </>
  );
}
