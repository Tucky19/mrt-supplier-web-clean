import Link from "next/link";
import type { ReactNode } from "react";
import type { SearchDemandDashboardData } from "@/lib/admin/searchDemand";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      {subtitle ? (
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SimpleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 align-top text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No data found in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SearchDemandDashboard({
  data,
}: {
  data: SearchDemandDashboardData;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Admin / Analytics
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Search and Missing Product Demand
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Search demand, no-result behavior, and Missing Product Requests from the
            last {data.days} days to help decide what to add next.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[7, 30, 90].map((days) => {
              const active = days === data.days;

              return (
                <Link
                  key={days}
                  href={`/admin/analytics?days=${days}`}
                  className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  {days} days
                </Link>
              );
            })}
            <Link
              href="/admin/rfq"
              className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Open RFQ list
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Searches" value={data.searchSummary.totalSearches} />
          <StatCard
            title="No-result Searches"
            value={data.searchSummary.noResultSearches}
          />
          <StatCard
            title="Missing Product Requests"
            value={data.missingProductRequests.total}
          />
          <StatCard
            title="Top Repeated No-result"
            value={data.recommendedNextActions.repeatedNoResultTerms[0]?.query || "-"}
            subtitle={
              data.recommendedNextActions.repeatedNoResultTerms[0]
                ? `${data.recommendedNextActions.repeatedNoResultTerms[0].searches} searches`
                : "No repeated no-result term yet"
            }
          />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <SectionCard
            title="Search Summary"
            description="High-level search demand and the terms customers are using most."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <SimpleTable
                headers={["Top search terms", "Count"]}
                rows={data.searchSummary.topSearchTerms.map((row) => [
                  row.query,
                  row.count,
                ])}
              />
              <SimpleTable
                headers={["Recent search terms", "Results", "Created"]}
                rows={data.searchSummary.recentSearchTerms.map((row) => [
                  row.query,
                  row.resultCount ?? "-",
                  formatDate(row.createdAt),
                ])}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="No-result Demand"
            description="Queries that did not return results, with links to related Missing Product Requests when available."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <SimpleTable
                headers={["Query", "No-result count", "Related request"]}
                rows={data.noResultDemand.topQueries.map((row) => [
                  <div key={`${row.query}-query`} className="font-medium text-slate-900">
                    {row.query}
                  </div>,
                  row.count,
                  row.latestRelatedRequest ? (
                    <div key={`${row.query}-related`} className="space-y-1">
                      <div>{row.relatedMissingRequests} related request(s)</div>
                      <Link
                        href={`/admin/rfq/${row.latestRelatedRequest.id}`}
                        className="text-sm font-medium text-sky-700 hover:text-sky-900"
                      >
                        {row.latestRelatedRequest.requestId}
                      </Link>
                    </div>
                  ) : (
                    <span key={`${row.query}-none`}>-</span>
                  ),
                ])}
              />
              <SimpleTable
                headers={["Latest no-result query", "Created", "Related request"]}
                rows={data.noResultDemand.latestSearches.map((row) => [
                  row.query,
                  formatDate(row.createdAt),
                  row.latestRelatedRequest ? (
                    <Link
                      key={`${row.id}-related`}
                      href={`/admin/rfq/${row.latestRelatedRequest.id}`}
                      className="text-sm font-medium text-sky-700 hover:text-sky-900"
                    >
                      {row.latestRelatedRequest.requestId}
                    </Link>
                  ) : (
                    "-"
                  ),
                ])}
              />
            </div>
          </SectionCard>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            title="Missing Product Requests"
            description="Recent requests and the product types customers are asking for."
          >
            <SimpleTable
              headers={[
                "Request ID",
                "Part No. / Filter Type",
                "Qty",
                "Search Query / Source Page",
                "Status",
                "Created",
              ]}
              rows={data.missingProductRequests.latestRequests.map((row) => [
                <Link
                  key={row.id}
                  href={`/admin/rfq/${row.id}`}
                  className="font-medium text-sky-700 hover:text-sky-900"
                >
                  {row.requestId}
                </Link>,
                <div key={`${row.id}-summary`}>
                  <div className="font-medium text-slate-900">
                    {row.partNo || row.filterType || "-"}
                  </div>
                  {row.filterType ? (
                    <div className="mt-1 text-xs text-slate-500">
                      Filter Type: {row.filterType}
                    </div>
                  ) : null}
                </div>,
                row.qty ?? "-",
                <div key={`${row.id}-context`}>
                  <div>{row.searchQuery || "-"}</div>
                  <div className="mt-1 text-xs text-slate-500 break-all">
                    {row.sourcePage || "-"}
                  </div>
                </div>,
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {row.status}
                </span>,
                formatDate(row.createdAt),
              ])}
            />
          </SectionCard>

          <div className="space-y-8">
            <SectionCard title="Count by Filter Type">
              <SimpleTable
                headers={["Filter Type", "Count"]}
                rows={data.missingProductRequests.countByFilterType.map((row) => [
                  row.filterType,
                  row.count,
                ])}
              />
            </SectionCard>

            <SectionCard title="Count by Status / Source">
              <div className="grid gap-6 md:grid-cols-2">
                <SimpleTable
                  headers={["Status", "Count"]}
                  rows={data.missingProductRequests.countByStatus.map((row) => [
                    row.status,
                    row.count,
                  ])}
                />
                <SimpleTable
                  headers={["Source", "Count"]}
                  rows={data.missingProductRequests.countBySource.map((row) => [
                    row.source,
                    row.count,
                  ])}
                />
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="mt-8">
          <SectionCard
            title="Recommended Next Actions"
            description="Practical follow-up suggestions based on repeated search demand and pending Missing Product Requests."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <SimpleTable
                headers={["Catalog opportunity", "Searches", "Related requests"]}
                rows={data.recommendedNextActions.catalogOpportunities.map((row) => [
                  row.query,
                  row.searches,
                  row.relatedMissingRequests,
                ])}
              />
              <SimpleTable
                headers={["Request needing review", "Status", "Created"]}
                rows={data.recommendedNextActions.requestsNeedingReview.map((row) => [
                  <div key={row.id}>
                    <Link
                      href={`/admin/rfq/${row.id}`}
                      className="font-medium text-sky-700 hover:text-sky-900"
                    >
                      {row.requestId}
                    </Link>
                    <div className="mt-1 text-xs text-slate-500">{row.summary}</div>
                  </div>,
                  row.status,
                  formatDate(row.createdAt),
                ])}
              />
              <SimpleTable
                headers={["Repeated no-result term", "Searches"]}
                rows={data.recommendedNextActions.repeatedNoResultTerms.map((row) => [
                  row.query,
                  row.searches,
                ])}
              />
            </div>
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
