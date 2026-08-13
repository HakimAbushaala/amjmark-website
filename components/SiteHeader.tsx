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
    <div className="sticky top-0 z-40">
      <div className="flex flex-col gap-1 border-b border-zinc-200 bg-zinc-50 px-6 py-1.5 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="text-zinc-500">
          Proudly printed in Fremont, CA <span className="mx-1.5 text-zinc-300">·</span> Serving the entire Bay Area
        </span>
        <span className="font-semibold text-brand-700">Same-day pickup available</span>
      </div>

      <header className="border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
          <Link href="/">
            <LogoMark />
          </Link>

          <nav className="hidden gap-6 text-xs font-bold uppercase tracking-wide text-zinc-600 lg:flex">
            <Link href="/shop" className="hover:text-zinc-900">
              Shop Transfers
            </Link>
            <Link href="/design" className="hover:text-zinc-900">
              Gang Sheet Builder
            </Link>
            <Link href="/pricing" className="hover:text-zinc-900">
              Sizes &amp; Pricing
            </Link>
            <Link href="/how-it-works" className="hover:text-zinc-900">
              How It Works
            </Link>
            <Link href="/about" className="hover:text-zinc-900">
              About Us
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-5 text-sm font-semibold text-zinc-600">
            {user ? (
              <Link href="/account" className="hover:text-zinc-900">
                Account
              </Link>
            ) : (
              <Link href="/account/login" className="hover:text-zinc-900">
                Sign In
              </Link>
            )}
            <Link href="/about" className="hidden hover:text-zinc-900 sm:inline">
              Pickup
            </Link>
            <Link href="/cart" className="hover:text-zinc-900">
              <CartBadge />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
