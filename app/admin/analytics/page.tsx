import { Suspense } from "react";

type Summary = {
  windowDays: number;
  totals: {
    search: number;
    click: number;
    rfq: number;
    conversion: number;
  };
};

type TopResp = {
  windowDays: number;
  topSearch: { query: string | null; count: number }[];
  topClick: { partNo: string | null; count: number }[];
  topRfq: { partNo: string | null; count: number }[];
};

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
}

async function SummaryCard({ days }: { days: number }) {
  const data = await fetchJSON<Summary>(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/analytics/summary?days=${days}`
  );

  const { search, click, rfq, conversion } = data.totals;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat title="Search" value={search} />
      <Stat title="Click" value={click} />
      <Stat title="RFQ" value={rfq} />
      <Stat title="Conversion" value={`${(conversion * 100).toFixed(2)}%`} />
    </div>
  );
}

async function TopTables({ days }: { days: number }) {
  const data = await fetchJSON<TopResp>(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/analytics/top?days=${days}&limit=10`
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Table
        title="Top Search"
        headers={["Query", "Count"]}
        rows={data.topSearch.map((r) => [
          r.query ?? "-",
          r.count,
        ])}
      />

      <Table
        title="Top Click"
        headers={["Part No", "Count"]}
        rows={data.topClick.map((r) => [
          r.partNo ?? "-",
          r.count,
        ])}
      />

      <Table
        title="Top RFQ"
        headers={["Part No", "Count"]}
        rows={data.topRfq.map((r) => [
          r.partNo ?? "-",
          r.count,
        ])}
      />
    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Table({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b px-5 py-3 text-sm font-semibold text-slate-900">
        {title}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              {headers.map((h) => (
                <th key={h} className="px-5 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-2 text-slate-800">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-5 py-6 text-center text-slate-500"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const days = Number(sp.days ?? "7") || 7;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Analytics (last {days} days)
          </h1>
        </div>

        <Suspense fallback={<div>Loading summary...</div>}>
          
          <SummaryCard days={days} />
        </Suspense>

        <div className="mt-6" />

        <Suspense fallback={<div>Loading tables...</div>}>
          
          <TopTables days={days} />
        </Suspense>
      </div>
    </main>
  );
}