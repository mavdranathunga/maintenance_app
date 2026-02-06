import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session) redirect("/");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  const role = (session.user as any)?.role;
  if (role !== "ADMIN") redirect("/dashboard"); // user can view dashboard but not admin pages
  return session;
}
