export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-transparent pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="font-bold tracking-[0.25em] text-white uppercase text-[10px]">AssetPro Suite</span>
            </div>
            <p className="mt-2 text-[10px] font-medium text-white/40 uppercase tracking-widest">
              Standardized Facility Operations
            </p>
          </div>

          <div className="flex items-center gap-10 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <span>v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}</span>
            <span className="text-emerald-500/40">{process.env.NEXT_PUBLIC_ENV || "PROD"}</span>
          </div>
        </div>

        <div className="text-center text-[9px] font-bold text-white/35 uppercase tracking-[0.4em] border-t border-white/[0.03] pt-8">
          © {new Date().getFullYear()} AssetPro Suite • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
