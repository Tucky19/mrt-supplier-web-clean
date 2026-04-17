// app/components/BrandBar.tsx
import Link from "next/link";

type Brand = {
  key: string;          // query value
  label: string;        // UI label
  hint?: string;        // small subtitle
  tone?: "red" | "amber" | "blue" | "neutral";
};

const BRANDS: Brand[] = [
  { key: "donaldson", label: "Donaldson", hint: "Filters", tone: "red" },
  { key: "mann", label: "MANN-FILTER", hint: "Filters", tone: "amber" },
  { key: "fleetguard", label: "Fleetguard", hint: "Filters", tone: "neutral" },
  { key: "ntn", label: "NTN", hint: "Bearings", tone: "blue" },
  { key: "koyo", label: "KOYO", hint: "Bearings", tone: "neutral" },
  { key: "iko", label: "IKO", hint: "Bearings", tone: "neutral" },
];

function toneCls(tone: Brand["tone"]) {
  switch (tone) {
    case "red":
      return "border-red-500/30 bg-red-500/10 hover:bg-red-500/15";
    case "amber":
      return "border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/15";
    case "blue":
      return "border-sky-400/30 bg-sky-400/10 hover:bg-sky-400/15";
    default:
      return "border-white/10 bg-white/5 hover:bg-white/10";
  }
}

export default function BrandBar() {
  return (
    <section className="mt-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white/90">Browse by Brand</h2>
          <p className="mt-1 text-xs text-white/55">
            คลิกเพื่อกรองแบรนด์ทันที (B2B quick entry)
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs text-white/60 hover:text-white/80"
        >
          Clear filter →
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {BRANDS.map((b) => (
          <Link
            key={b.key}
            href={`/products?brand=${encodeURIComponent(b.key)}`}
            className={[
              "group rounded-2xl border px-4 py-3 transition",
              "backdrop-blur",
              toneCls(b.tone),
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {b.label}
                </div>
                <div className="truncate text-xs text-white/60">{b.hint ?? ""}</div>
              </div>

              <div className="shrink-0 text-white/45 transition group-hover:text-white/80">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
