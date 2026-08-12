import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CartBadge } from "@/components/CartBadge";
import { LogoMark } from "@/components/LogoMark";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={36} />
          <span className="text-lg font-extrabold tracking-tight text-zinc-900">AMJ Mark</span>
        </Link>

        <nav className="hidden gap-6 text-sm font-semibold text-zinc-500 sm:flex">
          <Link href="/shop" className="hover:text-zinc-900">
            Shop
          </Link>
          <Link href="/design" className="hover:text-zinc-900">
            Design a Gang Sheet
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-5 text-sm font-semibold text-zinc-500">
          <Link href="/cart" className="hover:text-zinc-900">
            <CartBadge />
          </Link>
          {user ? (
            <Link href="/account" className="hover:text-zinc-900">
              Account
            </Link>
          ) : (
            <Link href="/account/login" className="hover:text-zinc-900">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
