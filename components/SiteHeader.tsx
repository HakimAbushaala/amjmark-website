import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CartBadge } from "@/components/CartBadge";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 font-extrabold text-slate-900">
            AM
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">AMJ Mark</span>
        </Link>

        <nav className="hidden gap-6 text-sm font-semibold text-slate-300 sm:flex">
          <Link href="/shop" className="hover:text-white">
            Shop
          </Link>
          <Link href="/design" className="hover:text-white">
            Design a Gang Sheet
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-5 text-sm font-semibold text-slate-300">
          <Link href="/cart" className="hover:text-white">
            <CartBadge />
          </Link>
          {user ? (
            <Link href="/account" className="hover:text-white">
              Account
            </Link>
          ) : (
            <Link href="/account/login" className="hover:text-white">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
