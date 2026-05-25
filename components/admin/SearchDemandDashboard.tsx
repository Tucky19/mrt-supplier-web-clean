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
  emptyMessage = "No data found in this period.",
}: {
  headers: string[];
  rows: ReactNode[][];
  emptyMessage?: string;
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
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

function CountList({
  rows,
  emptyMessage = "No data found in this period.",
}: {
  rows: Array<{
    id: string;
    label: ReactNode;
    count?: number | string;
    detail?: ReactNode;
  }>;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3"
        >
          <div className="min-w-0">
            <div className="break-words text-sm font-medium text-slate-900">
              {row.label}
            </div>
            {row.detail ? (
              <div className="mt-1 break-words text-xs leading-5 text-slate-500">
                {row.detail}
              </div>
            ) : null}
          </div>
          {row.count !== undefined ? (
            <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
              {row.count}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function LatestMissingRequestsList({
  requests,
}: {
  requests: SearchDemandDashboardData["missingProductRequests"]["latestRequests"];
}) {
  if (requests.length === 0) {
    return <EmptyState>No Missing Product Requests found in this period.</EmptyState>;
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {requests.map((row) => (
        <article
          key={row.id}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <Link
              href={`/admin/rfq/${row.id}`}
              className="font-medium text-sky-700 hover:text-sky-900"
            >
              {row.requestId}
            </Link>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {row.status}
            </span>
          </div>
          <div className="mt-3 text-sm font-medium text-slate-900">
            {row.partNo || row.filterType || "Missing product request"}
          </div>
          <div className="mt-2 grid gap-1 text-xs leading-5 text-slate-500 sm:grid-cols-2">
            <div>Qty: {row.qty ?? "-"}</div>
            <div>{formatDate(row.createdAt)}</div>
            {row.filterType ? <div>Filter Type: {row.filterType}</div> : null}
            {row.searchQuery ? <div>Search: {row.searchQuery}</div> : null}
          </div>
        </article>
      ))}
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
              <CountList
                rows={data.searchSummary.topSearchTerms.map((row) => ({
                  id: row.query,
                  label: row.query,
                  count: row.count,
                }))}
              />
              <CountList
                rows={data.searchSummary.recentSearchTerms.map((row) => ({
                  id: row.id,
                  label: row.query,
                  count: row.resultCount ?? 0,
                  detail: `Created ${formatDate(row.createdAt)}`,
                }))}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="No-result Demand"
            description="Queries that did not return results, with links to related Missing Product Requests when available."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <CountList
                rows={data.noResultDemand.topQueries.map((row) => ({
                  id: row.query,
                  label: row.query,
                  count: row.count,
                  detail: row.latestRelatedRequest ? (
                    <>
                      {row.relatedMissingRequests} related request(s):{" "}
                      <Link
                        href={`/admin/rfq/${row.latestRelatedRequest.id}`}
                        className="font-medium text-sky-700 hover:text-sky-900"
                      >
                        {row.latestRelatedRequest.requestId}
                      </Link>
                    </>
                  ) : (
                    "No related request yet"
                  ),
                }))}
              />
              <CountList
                rows={data.noResultDemand.latestSearches.map((row) => ({
                  id: row.id,
                  label: row.query,
                  count: row.relatedMissingRequests,
                  detail: (
                    <>
                      Created {formatDate(row.createdAt)}
                      {row.latestRelatedRequest ? (
                        <>
                          {" "}
                          / Related:{" "}
                          <Link
                            href={`/admin/rfq/${row.latestRelatedRequest.id}`}
                            className="font-medium text-sky-700 hover:text-sky-900"
                          >
                            {row.latestRelatedRequest.requestId}
                          </Link>
                        </>
                      ) : null}
                    </>
                  ),
                }))}
              />
            </div>
          </SectionCard>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            title="Missing Product Requests"
            description="Recent requests and the product types customers are asking for."
          >
            <LatestMissingRequestsList
              requests={data.missingProductRequests.latestRequests}
            />
          </SectionCard>

          <div className="space-y-8">
            <SectionCard title="Count by Filter Type">
              <CountList
                rows={data.missingProductRequests.countByFilterType.map((row) => ({
                  id: row.filterType,
                  label: row.filterType,
                  count: row.count,
                }))}
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
            title="Thread Size Demand"
            description="Top requested thread sizes from Missing Product Requests in this period."
          >
            <CountList
              rows={data.threadSizeDemand.topThreadSizes.map((row) => ({
                id: `${row.filterType}-${row.threadSize}`,
                label: row.threadSize,
                count: row.count,
                detail: row.filterType,
              }))}
              emptyMessage="No thread size demand found in this period."
            />
          </SectionCard>
        </div>

        <div className="mt-8">
          <SectionCard
            title="Dimension Demand"
            description="Top requested measured dimension combinations from Missing Product Requests when customers provided dimensions."
          >
            <CountList
              rows={data.dimensionDemand.topCombinations.map((row) => ({
                id: `${row.filterType}-${row.dimensions}`,
                label: row.dimensions,
                count: row.count,
                detail: row.filterType,
              }))}
              emptyMessage="No dimension demand found in this period."
            />
          </SectionCard>
        </div>

        <div className="mt-8">
          <SectionCard
            title="Recommended Next Actions"
            description="Practical follow-up suggestions based on repeated search demand and pending Missing Product Requests."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <CountList
                rows={data.recommendedNextActions.catalogOpportunities.map((row) => ({
                  id: row.query,
                  label: row.query,
                  count: row.searches,
                  detail: `${row.relatedMissingRequests} related request(s)`,
                }))}
              />
              <CountList
                rows={data.recommendedNextActions.requestsNeedingReview.map((row) => ({
                  id: row.id,
                  label: (
                    <Link
                      href={`/admin/rfq/${row.id}`}
                      className="font-medium text-sky-700 hover:text-sky-900"
                    >
                      {row.requestId}
                    </Link>
                  ),
                  detail: `${row.status} / ${formatDate(row.createdAt)} / ${row.summary}`,
                }))}
              />
              <CountList
                rows={data.recommendedNextActions.repeatedNoResultTerms.map((row) => ({
                  id: row.query,
                  label: row.query,
                  count: row.searches,
                }))}
              />
            </div>
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
