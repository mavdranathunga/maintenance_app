import Footer from "@/components/Footer";
import IdleLogout from "@/components/IdleLogout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <IdleLogout minutes={15} />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
