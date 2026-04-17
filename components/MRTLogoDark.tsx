export default function MRTLogoLight() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Tech Block */}
      <div className="relative flex h-11 w-14 items-center justify-center rounded-xl bg-[#0F172A]">
        <span className="text-white font-bold tracking-widest text-sm">MRT</span>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#DC2626] rounded-b-xl" />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-wide text-slate-950">
          MRT Supplier
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Industrial Parts · RFQ
        </span>
      </div>
    </div>
  );
}
