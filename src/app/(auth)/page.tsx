import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import ExpiredBanner from "@/components/ExpiredBanner";
import { ShieldCheck, ArrowRight, Chrome, Bell, Users, Clock } from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-[80vh] flex items-center justify-center">
      <ExpiredBanner />
      <div className="relative w-full max-w-5xl">
        {/* Glow */}
        <div className="pointer-events-none absolute -inset-6 -z-10 opacity-70 blur-3xl">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-500/30" />
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-cyan-400/20" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-400/15" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Brand / Features */}
          <section className="rounded-3xl border border-white/12 bg-white/[0.04] backdrop-blur-xl p-7 shadow-[0_30px_120px_rgba(0,0,0,0.45)] overflow-hidden relative">
            {/* decorative lines */}
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute top-24 -left-20 h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] backdrop-blur-3xl">
                <ShieldCheck className="h-3 w-3 text-emerald-400/80" />
                Technical Registry Prime
              </div>

              <h1 className="mt-6 text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                AssetPro
                <span className="text-white/40 block">Intelligence.</span>
              </h1>

              <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-sm font-medium">
                The internal standard for hardware lifecycle tracking and predictive maintenance orchestration.
              </p>

              <div className="mt-10 grid gap-4">
                <Feature
                  icon={<Clock className="h-4 w-4 text-purple-400" />}
                  title="Predictive Scheduling"
                  desc="Automated computation of service windows based on asset frequency."
                />
                <Feature
                  icon={<Users className="h-4 w-4 text-blue-400" />}
                  title="Multi-Tier Authorization"
                  desc="Granular registry access for assigned technicians and system admins."
                />
                <Feature
                  icon={<Bell className="h-4 w-4 text-orange-400" />}
                  title="Telemetry Notifications"
                  desc="Real-time dispatching of maintenance reminders via secure SMTP."
                />
              </div>
            </div>
          </section>

          {/* Right: Sign in */}
          <section className="rounded-3xl border border-white/12 bg-[#0b1020]/70 backdrop-blur-xl p-7 shadow-[0_30px_120px_rgba(0,0,0,0.55)] relative overflow-hidden">
            {/* top gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                  <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">System Authentication</span>
                </div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  Access Gateway
                </h2>

                <p className="mt-3 text-sm text-white/40 font-medium leading-relaxed">
                  Authorized Personnel Only: Utilize corporate OAuth credentials to initialize the secure session.
                </p>

                <div className="mt-10 space-y-8">
                  <div className="relative rounded-2xl border border-purple-300/20 bg-gradient-to-br from-purple-500/[0.08] via-white/[0.05] to-blue-500/[0.08] backdrop-blur-xl p-6 group transition-all hover:from-purple-500/[0.12] hover:to-blue-500/[0.12] overflow-hidden">
                    {/* Subtle animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="h-12 w-12 rounded-xl border border-purple-300/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center shadow-inner transition-transform group-hover:scale-105">
                        <Chrome className="h-6 w-6 text-purple-200/70" />
                      </div>

                      <div className="flex-1">
                        <div className="text-xs font-bold text-white/80 uppercase tracking-widest">Google Work Account</div>
                        <div className="text-[10px] text-purple-200/30 font-mono mt-0.5 uppercase tracking-tighter">
                          Encrypted Connection Active
                        </div>
                      </div>
                    </div>

                    <form
                      action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/dashboard" });
                      }}
                    >
                      <button className="w-full relative flex items-center justify-center gap-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 text-sm font-black hover:bg-white/15  transition-all active:scale-[0.98] z-10">
                        Continue Securely
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <div className="text-[9px] font-bold text-white/25 uppercase tracking-[0.3em] leading-relaxed italic text-center px-4">
                    Metadata logging is enabled. All interactions are permanently recorded to the system audit trail.
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.4em] text-white/25">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AssetPro Suite © {new Date().getFullYear()}</span>
                </div>
                <span className="font-mono text-[10px]">V1.0.4.CORP</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <div className="text-xs font-bold text-white/80 uppercase tracking-widest">{title}</div>
      </div>
      <div className="text-xs text-white/40 font-medium leading-relaxed">{desc}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
