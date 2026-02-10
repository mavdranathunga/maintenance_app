import Footer from "@/components/Footer";
import IdleLogout from "@/components/IdleLogout";
import { Toaster } from "sonner";
import FloatingAbout from "@/components/FloatingAbout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <IdleLogout minutes={15} />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        {children}
      </main>

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className:
            "bg-[#0b1020]/90 backdrop-blur-xl border border-white/12 text-white shadow-[0_20px_70px_rgba(0,0,0,0.55)]",
        }}
      />
      <Footer />
      <FloatingAbout />
    </div>
  );
}
