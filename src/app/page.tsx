import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // ✅ already logged in → go straight to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl glass-strong p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Maintenance Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/70">
          Track assets. Never miss a schedule.
        </p>

        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="w-full rounded-xl glass glass-hover px-4 py-2 transition">
            Sign in with Google
          </button>
        </form>
      </div>
    </main>
  );
}
