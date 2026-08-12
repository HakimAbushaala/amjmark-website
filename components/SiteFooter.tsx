import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-semibold text-white">AMJ Mark</span> — Premium DTF Transfers &amp; Print-on-Demand
        </div>
        <div className="flex gap-6">
          <a href="mailto:aabushaa@gmail.com" className="hover:text-amber-400">
            aabushaa@gmail.com
          </a>
          <Link href="/shop" className="hover:text-amber-400">
            Shop
          </Link>
          <Link href="/design" className="hover:text-amber-400">
            Start Designing
          </Link>
        </div>
      </div>
    </footer>
  );
}
