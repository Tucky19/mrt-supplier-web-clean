type Props = {
  brand: string;
  className?: string;
};

export default function BrandBadge({ brand, className = "" }: Props) {
  return (
    <span
      className={[
        "inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300",
        className,
      ].join(" ")}
    >
      {brand}
    </span>
  );
}