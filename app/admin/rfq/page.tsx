import Link from "next/link";
import prisma from "@/lib/prisma";
import BulkStatusActions from "@/components/admin/BulkStatusActions";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    view?: string;
    owner?: string;
  }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "New";
    case "in_progress":
      return "In Progress";
    case "quoted":
      return "Quoted";
    case "closed":
      return "Closed";
    case "spam":
      return "Spam";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "in_progress":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "quoted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "closed":
      return "border-slate-200 bg-slate-100 text-slate-700";
    case "spam":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getStatusOptions() {
  return [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "in_progress", label: "In Progress" },
    { value: "quoted", label: "Quoted" },
    { value: "closed", label: "Closed" },
    { value: "spam", label: "Spam" },
  ];
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function endOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
}

export const dynamic = "force-dynamic";

export default async function AdminRfqPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = String(params.q || "").trim();
  const status = String(params.status || "all").trim();
  const view = String(params.view || "all").trim();
  const owner = String(params.owner || "all").trim();
  const todayStart = startOfToday();
  const todayEnd = endOfToday();
  const now = new Date();

  const baseWhere = {
    ...(status !== "all"
      ? {
          status: status as
            | "new"
            | "in_progress"
            | "quoted"
            | "closed"
            | "spam",
        }
        
      : {}),
    ...(q
      ? {
          OR: [
            { requestId: { contains: q, mode: "insensitive" as const } },
            { company: { contains: q, mode: "insensitive" as const } },
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { lineId: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
      ...(owner !== "all"
  ? {
      assignedTo: owner,
    }
  : {}),
  };

  const rawRfqs = await prisma.rfq.findMany({
    where: baseWhere,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
      followUps: {
        orderBy: [{ doneAt: "asc" }, { dueAt: "asc" }],
        select: {
          id: true,
          dueAt: true,
          doneAt: true,
          note: true,
        },
      },
    },
    take: 100,
  });

  
  type RawRfq = (typeof rawRfqs)[number];

const ownerOptions = Array.from(
  new Set(
    rawRfqs
      .map((rfq: RawRfq) => rfq.assignedTo)
      .filter((value: RawRfq["assignedTo"]): value is string => Boolean(value))
  )
).sort();
  type RawFollowUp = RawRfq["followUps"][number];

  type EnrichedRfq = RawRfq & {
    pendingFollowUps: RawFollowUp[];
    nextPendingFollowUp: RawFollowUp | null;
    hasPendingFollowUp: boolean;
    hasOverdueFollowUp: boolean;
    hasNoFollowUp: boolean;
    createdToday: boolean;
  };

  const rfqs: EnrichedRfq[] = rawRfqs
    .map((rfq: RawRfq) => {
      
      const pendingFollowUps = rfq.followUps.filter(
        (f: RawFollowUp) => !f.doneAt
      );

      const nextPendingFollowUp = pendingFollowUps[0] ?? null;
      const hasPendingFollowUp = pendingFollowUps.length > 0;

      const hasOverdueFollowUp = pendingFollowUps.some(
        (f: RawFollowUp) => f.dueAt < now
      );

      const createdToday =
        rfq.createdAt >= todayStart && rfq.createdAt < todayEnd;

      return {
        ...rfq,
        pendingFollowUps,
        nextPendingFollowUp,
        hasPendingFollowUp,
        hasOverdueFollowUp,
        hasNoFollowUp: rfq.followUps.length === 0,
        createdToday,
      };
    })
    .filter((rfq: EnrichedRfq) => {
      switch (view) {
        case "today":
          return rfq.createdToday;
        case "overdue":
          return rfq.hasOverdueFollowUp;
        case "pending":
          return rfq.hasPendingFollowUp;
        case "quoted":
          return rfq.status === "quoted";
        default:
          return true;
      }
    });

  const [
    totalAll,
    totalNew,
    totalInProgress,
    totalQuoted,
    totalClosed,
    totalSpam,
    totalNewToday,
    totalPendingFollowUpsToday,
    totalOverdueFollowUps,
    recentPendingFollowUps,
  ] = await Promise.all([
    prisma.rfq.count(),
    prisma.rfq.count({ where: { status: "new" } }),
    prisma.rfq.count({ where: { status: "in_progress" } }),
    prisma.rfq.count({ where: { status: "quoted" } }),
    prisma.rfq.count({ where: { status: "closed" } }),
    prisma.rfq.count({ where: { status: "spam" } }),
    prisma.rfq.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    }),
    prisma.followUp.count({
      where: {
        doneAt: null,
        dueAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    }),
    prisma.followUp.count({
      where: {
        doneAt: null,
        dueAt: {
          lt: now,
        },
      },
    }),
    prisma.followUp.findMany({
      where: {
        doneAt: null,
      },
      orderBy: [{ dueAt: "asc" }],
      include: {
        rfq: {
          select: {
            id: true,
            requestId: true,
            company: true,
            name: true,
            status: true,
            assignedTo: true,
          },
        },
      },
      take: 8,
    }),
  ]);

  const statusOptions = getStatusOptions();

  const preservedQuery =
    `${status !== "all" ? `&status=${status}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  const quickViewOptions = [
    { value: "all", label: "All", href: "/admin/rfq" },
    { value: "today", label: "Today", href: `/admin/rfq?view=today${preservedQuery}` },
    { value: "overdue", label: "Overdue", href: `/admin/rfq?view=overdue${preservedQuery}` },
    { value: "pending", label: "Pending Follow-up", href: `/admin/rfq?view=pending${preservedQuery}` },
    { value: "quoted", label: "Quoted", href: `/admin/rfq?view=quoted${preservedQuery}` },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                RFQ Requests
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                ภาพรวมงานขาย คำขอราคา งานค้าง และ bulk actions สำหรับทีม
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Results{" "}
              <span className="font-semibold text-slate-900">{rfqs.length}</span>{" "}
              rows
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              New RFQ Today
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {totalNewToday}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
              Pending Today
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-900">
              {totalPendingFollowUpsToday}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">
              Overdue Follow-ups
            </p>
            <p className="mt-2 text-2xl font-semibold text-rose-900">
              {totalOverdueFollowUps}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Total RFQ
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {totalAll}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
              New
            </p>
            <p className="mt-2 text-2xl font-semibold text-blue-900">{totalNew}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
              In Progress
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-900">
              {totalInProgress}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Quoted
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">
              {totalQuoted}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              Closed
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalClosed}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">
              Spam
            </p>
            <p className="mt-2 text-2xl font-semibold text-rose-900">
              {totalSpam}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
             <form className="grid gap-4 lg:grid-cols-[1.1fr_0.8fr_0.8fr_auto]">
  <input type="hidden" name="view" value={view} />

  <div>
    <label className="mb-2 block text-sm font-medium text-slate-800">
      Search
    </label>
    <input
      type="text"
      name="q"
      defaultValue={q}
      placeholder="Search request ID, company, contact, email, phone"
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-slate-800">
      Status
    </label>
    <select
      name="status"
      defaultValue={status}
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-slate-800">
      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
       Owner
    </th>
    </label>
    <select
      name="owner"
      defaultValue={owner}
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
    >
      <option value="all">All Owners</option>
      {(ownerOptions as string[]).map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  </div>

  <div className="flex items-end gap-3">
    <button
      type="submit"
      className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
    >
      Apply
    </button>

    <Link
      href="/admin/rfq"
      className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
    >
      Reset
    </Link>
  </div>
</form>

              <div className="mt-5 flex flex-wrap gap-2">
                {quickViewOptions.map((option) => {
                  const active =
                    view === option.value ||
                    (option.value === "all" && view === "all");

                  return (
                    <Link
                      key={option.value}
                      href={option.href}
                      className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900"
                      }`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <BulkStatusActions
              rfqs={rfqs.map((rfq) => ({
                id: rfq.id,
                requestId: rfq.requestId,
              }))}
            />

            {rfqs.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-slate-950">
                  ไม่พบรายการที่ตรงเงื่อนไข
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  ลองเปลี่ยนคำค้นหา สถานะ หรือ quick filter แล้วค้นหาใหม่อีกครั้ง
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Request ID
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Customer
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Contact
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Items
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Follow-up
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Status
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Created
                        </th>
                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {rfqs.map((rfq: EnrichedRfq) => (
                        <tr key={rfq.id} className="align-top">
                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-900">
                              {rfq.requestId}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <span className="text-xs text-slate-500">
                                Source: {rfq.source || "web"}
                              </span>

                              {rfq.createdToday ? (
                                <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                  Today
                                </span>
                              ) : null}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-900">
                              {rfq.company || "-"}
                            </div>
                            <div className="mt-1 text-sm text-slate-600">
                              {rfq.name || "-"}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            <div>{rfq.phone || "-"}</div>
                            <div className="mt-1">{rfq.email || "-"}</div>
                            <div className="mt-1">{rfq.lineId || "-"}</div>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            <span className="font-medium text-slate-900">
                              {rfq._count.items}
                            </span>{" "}
                            item(s)
                          </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-slate-900">
                              {rfq.assignedTo || "-"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                              {rfq.assignedAt ? `Assigned: ${formatDate(rfq.assignedAt)}` : "Unassigned"}
                          </div>
                        </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              {rfq.hasOverdueFollowUp ? (
                                <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                                  Overdue
                                </span>
                              ) : null}

                              {!rfq.hasOverdueFollowUp && rfq.hasPendingFollowUp ? (
                                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                  Pending
                                </span>
                              ) : null}

                              {rfq.hasNoFollowUp ? (
                                <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                  No Follow-up
                                </span>
                              ) : null}
                            </div>

                            {rfq.nextPendingFollowUp ? (
                              <div className="mt-2 text-xs leading-5 text-slate-500">
                                Due: {formatDate(rfq.nextPendingFollowUp.dueAt)}
                              </div>
                            ) : null}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                rfq.status
                              )}`}
                            >
                              {getStatusLabel(rfq.status)}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {formatDate(rfq.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/admin/rfq/${rfq.id}`}
                              className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-950">
                  Pending Follow-ups
                </h2>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {recentPendingFollowUps.length}
                  </span>{" "}
                  shown
                </div>
              </div>
                  
              {recentPendingFollowUps.length === 0 ? (
                <p className="mt-5 text-sm text-slate-600">
                  No pending follow-ups right now.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {recentPendingFollowUps.map(
                    (followUp: (typeof recentPendingFollowUps)[number]) => {
                      const isOverdue = followUp.dueAt < now;

                      return (
                        <Link
                          key={followUp.id}
                          href={`/admin/rfq/${followUp.rfq.id}`}
                          className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {followUp.rfq.requestId}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {followUp.rfq.company || followUp.rfq.name || "-"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                           Owner: {followUp.rfq.assignedTo || "-"}
                              </p>
                              <p className="mt-2 text-xs text-slate-500">
                                Due: {formatDate(followUp.dueAt)}
                              </p>
                              {followUp.note ? (
                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {followUp.note}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                  followUp.rfq.status
                                )}`}
                              >
                                {getStatusLabel(followUp.rfq.status)}
                              </span>

                              {isOverdue ? (
                                <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                                  Overdue
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}