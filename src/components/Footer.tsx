export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-white/50">
        <div>
          Maintenance Dashboard © {new Date().getFullYear()} 
        </div>

        <div className="mt-1 flex flex-wrap justify-center gap-2 text-white/40">
          <span>v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0" }</span>
          <span>•</span>
          <span>Powered by Next.js</span>
          <span>•</span>
          <span className="text-emerald-400/70">{process.env.NEXT_PUBLIC_ENV || "Production"}</span>
        </div>
      </div>
    </footer>
  );
}
 