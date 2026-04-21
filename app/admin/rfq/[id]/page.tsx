import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RfqFollowUpForm } from '@/components/admin/RfqFollowUpForm';
import FollowUpDoneButton from "@/components/admin/FollowUpDoneButton";
import QuoteRecordForm from "@/components/admin/QuoteRecordForm";
import QuoteDocumentForm from "@/components/admin/QuoteDocumentForm";
import OwnerAssignmentForm from "@/components/admin/OwnerAssignmentForm";
import { RfqStatusForm } from "@/components/admin/rfq-status-form";
import { RfqQuoteForm } from '@/components/admin/rfq-quote-form';
import RfqNoteForm from "@/components/admin/RfqNoteForm";
type PageProps = {
  params: Promise<{ id: string }>;
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

function getTimelineTitle(type: string, payload: unknown) {
  const data =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;

  switch (type) {
    case "created":
      return "RFQ Created";
    case "emailed_admin":
      return "Admin Email Sent";
    case "emailed_customer":
      return "Customer Email Sent";
    case "email_failed":
      return "Email Failed";
    case "viewed":
      return "Viewed";
    case "status_changed": {
      const from = typeof data?.from === "string" ? data.from : null;
      const to = typeof data?.to === "string" ? data.to : null;

      if (from && to) {
        return `Status Changed: ${getStatusLabel(from)} → ${getStatusLabel(to)}`;
      }

      return "Status Changed";
    }
    case "note":
      return "Internal Note Added";
    case "follow_up": {
      const action = typeof data?.action === "string" ? data.action : null;
      if (action === "done") return "Follow-up Marked Done";
      return "Follow-up Added";
    }
    case "quote_record":
      return "Quote Record Saved";
    case "quote_document":
      return "Quote Document Saved";
    case "owner_assigned":
      return "Owner Assigned";
    default:
      return type;
  }
}

function getTimelineDescription(type: string, payload: unknown) {
  const data =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;

  if (type === "note") {
    return typeof data?.body === "string" ? data.body : null;
  }

  if (type === "follow_up") {
    const action = typeof data?.action === "string" ? data.action : null;
    const note = typeof data?.note === "string" ? data.note : null;
    const dueAt = typeof data?.dueAt === "string" ? data.dueAt : null;

    if (action === "created") {
      const dueLabel = dueAt ? formatDate(new Date(dueAt)) : null;

      if (note && dueLabel) return `Due: ${dueLabel} • ${note}`;
      if (dueLabel) return `Due: ${dueLabel}`;
      if (note) return note;
    }

    if (action === "done") {
      return "Follow-up completed";
    }
  }

  if (type === "quote_record") {
    const ref = typeof data?.quoteRef === "string" ? data.quoteRef : null;
    const by = typeof data?.quotedBy === "string" ? data.quotedBy : null;
    const amount =
      typeof data?.quoteAmount === "string" ? data.quoteAmount : null;
    const currency =
      typeof data?.quoteCurrency === "string" ? data.quoteCurrency : null;

    const chunks = [
      ref ? `Ref: ${ref}` : null,
      by ? `By: ${by}` : null,
      amount ? `Amount: ${amount}${currency ? ` ${currency}` : ""}` : null,
    ].filter(Boolean);

    return chunks.length > 0 ? chunks.join(" • ") : "Quote record updated";
  }

  if (type === "quote_document") {
    const url =
      typeof data?.quoteDocumentUrl === "string" ? data.quoteDocumentUrl : null;
    const note =
      typeof data?.quoteSentNote === "string" ? data.quoteSentNote : null;

    if (url && note) return `${url} • ${note}`;
    if (url) return url;
    if (note) return note;

    return "Quote document updated";
  }
  if (type === "owner_assigned") {
  const from = typeof data?.from === "string" ? data.from : null;
  const to = typeof data?.to === "string" ? data.to : null;

  if (from && to) return `${from} → ${to}`;
  if (!from && to) return `Assigned to ${to}`;
  if (from && !to) return `Unassigned from ${from}`;
  return "Owner updated";
}

  return null;
}

export const dynamic = "force-dynamic";

export default async function AdminRfqDetailPage({ params }: PageProps) {
  const { id } = await params;

  const rfq = await prisma.rfq.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
      events: {
        orderBy: { createdAt: "desc" },
      },
      notes: {
        orderBy: { createdAt: "desc" },
      },
      lead: true,
      followUps: {
        orderBy: [{ doneAt: "asc" }, { dueAt: "asc" }],
      },
    },
  });

  if (!rfq) {
    notFound();
  }

  const notes = rfq.notes ?? [];
  const events = rfq.events ?? [];
  const followUps = rfq.followUps ?? [];
  const items = rfq.items ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/admin/rfq"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                ← Back to RFQ List
              </Link>

              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Admin / RFQ Detail
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {rfq.requestId}
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Created at {formatDate(rfq.createdAt)}
              </p>
            </div>

            <div>
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusClass(
                  rfq.status
                )}`}
              >
                {getStatusLabel(rfq.status)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Customer Information
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Company
                </p>
                <p className="mt-2 text-sm text-slate-900">{rfq.company || "-"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Contact Name
                </p>
                <p className="mt-2 text-sm text-slate-900">{rfq.name || "-"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Phone
                </p>
                <p className="mt-2 text-sm text-slate-900">{rfq.phone || "-"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-sm text-slate-900">{rfq.email || "-"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  LINE ID
                </p>
                <p className="mt-2 text-sm text-slate-900">{rfq.lineId || "-"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Contact Preference
                </p>
                <p className="mt-2 text-sm text-slate-900">
                  {rfq.contactPref || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">
                Requested Items
              </h2>

              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {items.length}
                </span>{" "}
                item(s)
              </div>
            </div>

            {items.length === 0 ? (
              <p className="mt-5 text-sm text-slate-600">No items found.</p>
            ) : (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Part No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Brand
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Qty
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      {items.map((item: (typeof items)[number]) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 text-sm font-medium text-slate-900">
                            {item.partNo}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            {item.brand || "-"}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            <div>{item.title || "-"}</div>
                            {item.category ? (
                              <div className="mt-1 text-xs text-slate-500">
                                Category: {item.category}
                              </div>
                            ) : null}
                            {item.spec ? (
                              <div className="mt-1 text-xs text-slate-500">
                                Spec: {item.spec}
                              </div>
                            ) : null}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-900">
                            {item.qty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Customer Notes</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {rfq.note || "No additional notes."}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">Timeline</h2>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {events.length}
                </span>{" "}
                event(s)
              </div>
            </div>

            {events.length === 0 ? (
              <p className="mt-5 text-sm text-slate-600">No timeline yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {events.map((event: (typeof events)[number]) => {
                  const title = getTimelineTitle(event.type, event.payload);
                  const desc = getTimelineDescription(event.type, event.payload);

                  return (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {title}
                          </p>
                          {desc ? (
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {desc}
                            </p>
                          ) : null}
                        </div>

                        <p className="shrink-0 text-xs text-slate-500">
                          {formatDate(event.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-violet-200 bg-violet-50/40 p-6 shadow-sm">
  <h2 className="text-xl font-semibold text-slate-950">
    Owner Assignment
  </h2>
  <p className="mt-2 text-sm leading-6 text-slate-600">
    Assign this RFQ to a team member and track accountability.
  </p>

  <div className="mt-5">
    <OwnerAssignmentForm
      rfqId={rfq.id}
      initialAssignedTo={rfq.assignedTo}
    />
  </div>

  <div className="mt-6 grid gap-3 sm:grid-cols-2">
    <div className="rounded-2xl bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        Assigned To
      </p>
      <p className="mt-2 text-sm text-slate-900">
        {rfq.assignedTo || "-"}
      </p>
    </div>

    <div className="rounded-2xl bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        Assigned At
      </p>
      <p className="mt-2 text-sm text-slate-900">
        {rfq.assignedAt ? formatDate(rfq.assignedAt) : "-"}
      </p>
    </div>
  </div>
</div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Status</h2>

            <div className="mt-5">
              <div className="mb-4">
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusClass(
                    rfq.status
                  )}`}
                >
                  {getStatusLabel(rfq.status)}
                </span>
              </div>

              <RfqStatusForm rfqId={rfq.id} currentStatus={rfq.status} />
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Quote Record
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Save quotation reference, amount, quoted date, validity, and owner.
            </p>

            <div className="mt-5">
              <QuoteRecordForm
                rfqId={rfq.id}
                currentStatus={rfq.status}
                initialQuoteRef={rfq.quoteRef}
                initialQuotedBy={rfq.quotedBy}
                initialQuoteAmount={rfq.quoteAmount ? rfq.quoteAmount.toString() : null}
                initialQuoteCurrency={rfq.quoteCurrency}
                initialQuotedAt={rfq.quotedAt ? rfq.quotedAt.toISOString() : null}
                initialValidUntil={rfq.validUntil ? rfq.validUntil.toISOString() : null}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-sky-200 bg-sky-50/40 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Quote Document
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Save quotation document link, sent date, and delivery note.
            </p>

            <div className="mt-5">
              <QuoteDocumentForm
                rfqId={rfq.id}
                currentStatus={rfq.status}
                initialQuoteDocumentUrl={rfq.quoteDocumentUrl}
                initialQuoteSentAt={rfq.quoteSentAt ? rfq.quoteSentAt.toISOString() : null}
                initialQuoteSentNote={rfq.quoteSentNote}
              />
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Document URL
                </p>
                <div className="mt-2 text-sm text-slate-900 break-all">
                  {rfq.quoteDocumentUrl ? (
                    <a
                      href={rfq.quoteDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 underline underline-offset-2"
                    >
                      {rfq.quoteDocumentUrl}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Quote Sent At
                </p>
                <p className="mt-2 text-sm text-slate-900">
                  {rfq.quoteSentAt ? formatDate(rfq.quoteSentAt) : "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Quote Sent Note
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-900">
                  {rfq.quoteSentNote || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Internal Notes</h2>

            <div className="mt-5">
              <RfqNoteForm rfqId={rfq.id} />
            </div>

            {notes.length === 0 ? (
              <p className="mt-5 text-sm text-slate-600">No internal notes yet.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {notes.map((note: (typeof notes)[number]) => (
                  <div
                    key={note.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm leading-7 text-slate-800">{note.body}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Follow-ups</h2>

            <div className="mt-5">
              <RfqFollowUpForm rfqId={rfq.id} />
            </div>

            {followUps.length === 0 ? (
              <p className="mt-5 text-sm text-slate-600">No follow-ups yet.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {followUps.map((followUp: (typeof followUps)[number]) => {
                  const isOverdue = !followUp.doneAt && followUp.dueAt < new Date();

                  return (
                    <div
                      key={followUp.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Due: {formatDate(followUp.dueAt)}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <p className="text-sm text-slate-600">
                              Status: {followUp.doneAt ? "Done" : "Pending"}
                            </p>

                            {isOverdue ? (
                              <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                                Overdue
                              </span>
                            ) : null}
                          </div>

                          {followUp.note ? (
                            <p className="mt-2 text-sm leading-6 text-slate-700">
                              {followUp.note}
                            </p>
                          ) : null}
                        </div>

                        {!followUp.doneAt ? (
                          <FollowUpDoneButton followUpId={followUp.id} />
                        ) : null}
                      </div>

                      {followUp.doneAt ? (
                        <p className="mt-3 text-xs text-slate-500">
                          Completed at {formatDate(followUp.doneAt)}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Meta</h2>

            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Source
                </p>
                <p className="mt-2">{rfq.source || "-"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Created At
                </p>
                <p className="mt-2">{formatDate(rfq.createdAt)}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Updated At
                </p>
                <p className="mt-2">{formatDate(rfq.updatedAt)}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Lead ID
                </p>
                <p className="mt-2">{rfq.leadId || "-"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  User Agent
                </p>
                <p className="mt-2 break-all">{rfq.userAgent || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
