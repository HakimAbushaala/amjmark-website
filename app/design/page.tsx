import Link from "next/link";

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold text-zinc-900">Build Your Gang Sheet</h1>
      <p className="mx-auto mt-4 max-w-xl text-zinc-500">
        Upload your designs, auto-pack them onto a sheet, drag/resize/rotate to fine-tune, and see your price
        update live at 300 DPI print quality. When you&apos;re done, it drops straight into your cart.
      </p>
      <Link
        href="/gang-sheet-builder.html"
        className="mt-10 inline-block rounded-full bg-zinc-900 px-8 py-4 font-bold text-white shadow-sm transition hover:bg-zinc-800"
      >
        Launch the Builder →
      </Link>
    </div>
  );
}
