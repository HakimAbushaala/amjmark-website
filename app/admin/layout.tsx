import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already requires login for /admin; this checks the *role*,
  // which lives in our DB rather than the Supabase JWT.
  if (!user) redirect("/account/login?redirect=/admin");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center gap-6 border-b border-zinc-200 pb-4">
        <h1 className="font-display text-2xl font-extrabold text-zinc-900">Admin</h1>
        <nav className="flex gap-5 text-sm font-semibold text-zinc-500">
          <Link href="/admin" className="hover:text-zinc-900">
            Orders
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
