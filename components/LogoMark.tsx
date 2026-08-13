// Bold wordmark matching the locked reference design: "AMJ MARK" in a
// heavy serif face, "DTF TRANSFERS" as a small tracked-out subtitle.
export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-logo font-black tracking-tight text-zinc-900 ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
        AMJ MARK
      </span>
      <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
        DTF Transfers
      </span>
    </span>
  );
}
