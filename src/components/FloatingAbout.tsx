"use client";

import { useState, useSyncExternalStore } from "react";
import { X, Cpu, Code2, ShieldCheck, Github, Fingerprint, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function FloatingAbout() {
  const [open, setOpen] = useState(false);
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isClient) return null;

  return (
    <>
      {/* Background Overlay for auto-close */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] transition-all duration-500 animate-in fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating Branded Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-8 right-8 z-50 flex items-center justify-center w-11 h-11 rounded-xl",
          "glass-strong border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500",
          "hover:scale-110 active:scale-95 group overflow-hidden",
          open
            ? "bg-white/20 ring-4 ring-purple-500/20 rotate-180"
            : "bg-white/5 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        )}
      >
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {open ? (
          <div className="relative rotate-45">
            <X size={18} strokeWidth={1.5} className="text-white/90" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <Fingerprint
              size={20}
              strokeWidth={1.5}
              className="text-white/70 group-hover:text-purple-300 transition-all duration-500 group-hover:blur-[0.5px]"
            />
            <Sparkles
              size={10}
              className="absolute -top-1 -right-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </div>
        )}
      </button>

      {/* Glass Popup Card */}
      {open && (
        <div
          className={cn(
            "fixed bottom-24 right-8 z-50 w-[280px] overflow-hidden",
            "bg-[#0f172a]/12 backdrop-blur-3xl border border-white/20 rounded-[28px] shadow-[0_32px_128px_rgba(0,0,0,0.8)]",
            "p-5 text-white text-sm",
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out"
          )}
        >
          {/* Decorative mesh background */}
          <div className="absolute -top-16 -right-16 h-32 w-32 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-5 relative">
            <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-purple-500/20 to-blue-600/20 flex items-center justify-center border border-white/15 shadow-xl backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white/95">
                AssetPro <span className="text-white/30 font-medium ml-1 text-xs italic">Suite</span>
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] font-bold text-white/40 tracking-wider border border-white/10 uppercase">
                  v1.0.4 r-stable
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4 relative">
            <div className="group flex items-start gap-3.5 p-2.5 rounded-2xl transition-colors hover:bg-white/5 border border-transparent hover:border-white/5">
              <div className="mt-1 flex items-center justify-center h-7 w-7 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Cpu className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/80 font-semibold text-[10px] mb-0.5 tracking-wide uppercase opacity-50">Architect</p>
                <p className="text-[12px] text-white/90">Deshan Ranathunga</p>
                <p className="text-[10px] text-white/40 font-medium">Systems Engineering Lead</p>
              </div>
            </div>

            <div className="group flex items-start gap-3.5 p-2.5 rounded-2xl transition-colors hover:bg-white/5 border border-transparent hover:border-white/5">
              <div className="mt-1 flex items-center justify-center h-7 w-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white/80 font-semibold text-[10px] mb-0.5 tracking-wide uppercase opacity-50">Environment</p>
                <p className="text-[12px] text-white/90 italic">Next.js • Prisma • Postgres</p>
                <p className="text-[10px] text-white/40 font-medium">Internal Performance Stack</p>
              </div>
            </div>
          </div>

          {/* Footer Status */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between relative">
            <div className="flex items-center gap-2.5 text-[10px] text-white/50 font-bold tracking-widest uppercase">
              <div className="relative flex h-2 w-2">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></div>
              </div>
              Core Secure
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group/github flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/15"
            >
              <span className="text-[10px] text-white/60 group-hover/github:text-white/80 transition-colors">GitHub</span>
              <Github className="h-4 w-4 text-white/60 group-hover/github:text-white/90 transition-all group-hover/github:rotate-[360deg] duration-500" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
