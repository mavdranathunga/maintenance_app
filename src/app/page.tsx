import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import ExpiredBanner from "@/components/ExpiredBanner";

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
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                Internal Maintenance System
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                Maintenance
                <span className="text-white/70"> Reminder</span>{" "}
                <span className="text-white/70">Dashboard</span>
              </h1>

              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Track assets, predict due dates, and notify the right team —
                without spreadsheets.
              </p>

              <div className="mt-6 grid gap-3">
                <Feature
                  title="Auto due-date + status"
                  desc="Next due date and badges computed from last maintenance + frequency."
                />
                <Feature
                  title="Admin + User access"
                  desc="Admins manage assets. Users only view schedules and reminders."
                />
                <Feature
                  title="Email reminders"
                  desc="Daily cron sends grouped reminders per assignee."
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
                <div className="text-xs text-white/60">Welcome back</div>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Sign in to continue
                </h2>

                <p className="mt-2 text-sm text-white/70">
                  Use your work Google account to access the dashboard.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          fill="#FFC107"
                          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.659 29.196 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.41 4.337-17.694 10.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24 44c5.099 0 9.787-1.957 13.313-5.153l-6.144-5.2C29.196 36 26.715 37 24 37c-5.176 0-9.56-3.323-11.086-7.946l-6.53 5.027C9.623 40.556 16.312 44 24 44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611 20.083H42V20H24v8h11.303c-.723 2.045-2.06 3.771-3.834 4.847l.003-.002 6.144 5.2C36.875 39.278 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium">Google Sign-in</div>
                      <div className="text-xs text-white/60">
                        Secure access via OAuth
                      </div>
                    </div>
                  </div>

                  <form
                    className="mt-4"
                    action={async () => {
                      "use server";
                      await signIn("google", { redirectTo: "/dashboard" });
                    }}
                  >
                    <button className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/15 transition">
                      Continue with Google
                    </button>
                  </form>
                </div>

                <div className="mt-4 text-xs text-white/50 leading-relaxed">
                  By continuing, you agree to your organization’s internal IT
                  policies. If you need access, contact the admin.
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-xs text-white/50">
                <span>© {new Date().getFullYear()} Maintenance</span>
                <span className="text-white/60">v1.0</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-sm text-white/65 leading-relaxed">{desc}</div>
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
