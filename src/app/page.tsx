import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Maintenance Dashboard</h1>
        <p className="text-sm opacity-70 mt-1">Login to continue</p>

        <div className="mt-6">
          {!session ? (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button className="w-full rounded-xl border px-4 py-2">
                Sign in with Google
              </button>
            </form>
          ) : (
            <>
              <div className="text-sm mt-2">
                Logged in as <b>{session.user?.email}</b>
              </div>

              <div className="mt-4 flex gap-2">
                <a className="flex-1 rounded-xl border px-4 py-2 text-center" href="/dashboard">
                  Go to dashboard
                </a>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button className="rounded-xl border px-4 py-2">Logout</button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
