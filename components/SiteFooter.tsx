import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoMark compact />
          <p className="mt-4 max-w-xs text-sm text-zinc-500">
            Premium DTF transfers, printed locally in Fremont, CA for creators, brands, and businesses.
          </p>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">Shop</div>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li>
              <Link href="/shop" className="hover:text-zinc-900">
                All Transfers
              </Link>
            </li>
            <li>
              <Link href="/design" className="hover:text-zinc-900">
                Gang Sheet Builder
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-zinc-900">
                Sizes &amp; Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">Company</div>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li>
              <Link href="/about" className="hover:text-zinc-900">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-zinc-900">
                How It Works
              </Link>
            </li>
            <li>
              <a href="mailto:info@amjmark.com" className="hover:text-zinc-900">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">Contact</div>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li>Fremont, CA</li>
            <li>
              <a href="mailto:info@amjmark.com" className="hover:text-zinc-900">
                info@amjmark.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200 py-5 text-center text-xs text-zinc-400">
        © {year} AMJ Mark DTF Transfers. All rights reserved.
      </div>
    </footer>
  );
}
