"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PackageSearch,
  Boxes,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuote } from "@/providers/QuoteProvider";

type Props = {
  locale: string;
};

type FormState = {
  company: string;
  name: string;
  phone: string;
  email: string;
  lineId: string;
  note: string;
};

export default function QuoteFormClient({ locale }: Props) {
  const t = useTranslations("rfq");
  const { items, ready, setQty, removeItem, clear } = useQuote();
  const isThai = locale === "th";

  const [form, setForm] = useState<FormState>({
    company: "",
    name: "",
    phone: "",
    email: "",
    lineId: "",
    note: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const lineUrl = "https://lin.ee/R3vfZW0";
  const hasItems = items.length > 0;
  const router = useRouter();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string {
    if (!form.name.trim()) {
      return isThai ? "กรุณากรอกชื่อผู้ติดต่อ" : "Please enter contact name.";
    }

    const hasContact =
      form.phone.trim() || form.email.trim() || form.lineId.trim();

    if (!hasContact) {
      return t("contactHint");
    }

    if (!hasItems) {
      return isThai
        ? "กรุณาเลือกรายการสินค้าอย่างน้อย 1 รายการก่อนส่งคำขอ"
        : "Please add at least one item before submitting.";
    }

    return "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccessId(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/rfq/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            company: form.company.trim(),
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            lineId: form.lineId.trim(),
            note: form.note.trim(),
          },
          items,
        }),
      });

      let data: {
        ok?: boolean;
        requestId?: string;
        error?: string;
      } | null = null;

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = (await res.json()) as {
          ok?: boolean;
          requestId?: string;
          error?: string;
        };
      } else {
        const text = await res.text();
        console.error("Non-JSON response from /api/rfq/submit:", {
          status: res.status,
          contentType,
          bodyPreview: text.slice(0, 300),
        });

        throw new Error(
          isThai
            ? "ระบบตอบกลับผิดรูปแบบ กรุณาลองใหม่"
            : "Unexpected server response. Please try again."
        );
      }

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error ||
            (isThai
              ? "ส่งคำขอไม่สำเร็จ กรุณาลองใหม่"
              : "Failed to submit request. Please try again.")
        );
      }

      const nextRequestId = data.requestId || "RFQ";

      setSuccessId(nextRequestId);
      setForm({
        company: "",
        name: "",
        phone: "",
        email: "",
        lineId: "",
        note: "",
      });
      clear();

      router.push(
        `/${locale}/quote/success?rid=${encodeURIComponent(nextRequestId)}`
      );
    } catch (err) {
      console.error("[QUOTE_SUBMIT_ERROR]", err);
      setError(
        err instanceof Error
          ? err.message
          : isThai
          ? "เกิดข้อผิดพลาด กรุณาลองใหม่"
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              <Boxes className="h-3.5 w-3.5" />
              {isThai ? "รายการขอราคา" : "Quote Request"}
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              {isThai ? "ส่งคำขอราคา" : "Send a Quote Request"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {isThai
                ? "ตรวจสอบรายการสินค้า ปรับจำนวน และกรอกข้อมูลติดต่อเพื่อให้ทีมงานเสนอราคาได้เร็วขึ้น"
                : "Review selected items, adjust quantities, and enter your contact details for quotation support."}
            </p>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                {isThai ? "Fast track สำหรับ Quote" : "Fast track for Quote"}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {isThai
                  ? "ใส่ Contact name + ช่องทางติดต่ออย่างน้อย 1 อย่าง แล้วเพิ่ม Part Number หรือ Cross Reference ใน Note ได้เลย ทีมงานจะเช็กให้ต่อเร็วขึ้น"
                  : "Add a contact name plus at least one contact method, then include any Part Number or Cross Reference in the note so our team can check faster."}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">
                {isThai ? "กรอกขั้นต่ำเพื่อส่ง RFQ" : "Minimum details to send RFQ"}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {isThai
                  ? "ใส่ชื่อผู้ติดต่อ และ Phone, Email หรือ LINE อย่างน้อย 1 อย่าง ก็ส่งคำขอได้เลย"
                  : "Add a contact name plus at least one of phone, email, or LINE to submit."}
              </p>
            </div>
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={onSubmit}>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                    <PackageSearch className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {isThai ? "รายการที่เลือก" : "Selected Items"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {ready
                        ? isThai
                          ? `${items.length} รายการ`
                          : `${items.length} item(s)`
                        : isThai
                        ? "กำลังโหลด..."
                        : "Loading..."}
                    </p>
                  </div>
                </div>

                {hasItems ? (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                  >
                    {isThai ? "ล้างทั้งหมด" : "Clear All"}
                  </button>
                ) : null}
              </div>

              {!ready ? null : hasItems ? (
                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {item.partNo}
                          </p>
                          {item.title ? (
                            <p className="mt-1 text-sm text-slate-600">
                              {item.title}
                            </p>
                          ) : null}
                          {item.brand ? (
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                              {item.brand}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center rounded-2xl border border-slate-300 bg-white shadow-sm">
                            <button
                              type="button"
                              onClick={() => setQty(item.productId, item.qty - 1)}
                              className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <input
                              type="number"
                              min={1}
                              max={999}
                              value={item.qty}
                              onChange={(e) =>
                                setQty(item.productId, Number(e.target.value) || 1)
                              }
                              className="h-11 w-20 border-x border-slate-300 text-center text-sm font-semibold text-slate-900 outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => setQty(item.productId, item.qty + 1)}
                              className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                          >
                            <Trash2 className="h-4 w-4" />
                            {isThai ? "ลบ" : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                  <p className="text-sm font-medium text-slate-900">
                    {isThai
                      ? "ยังไม่มีรายการสินค้าในคำขอราคา"
                      : "No items in your quote request yet"}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {isThai
                      ? "เริ่มจากค้นหาสินค้า หรือส่งรายการให้ทีมงานทาง LINE เพื่อช่วยเช็กต่อได้เลย"
                      : "Start by searching products or send your list on LINE so our team can help check it."}
                  </p>
                  <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href={`/${locale}/products`}
                      className="inline-flex min-w-[200px] justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      {isThai ? "ค้นหาสินค้า" : "Search Products"}
                    </Link>
                    <a
                      href={lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {isThai ? "แชทผ่าน LINE" : "Chat on LINE"}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/70 p-5">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-slate-950">
                  {isThai ? "ข้อมูลติดต่อ" : "Contact Details"}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {isThai
                    ? "ทีมงานจะใช้ข้อมูลนี้เพื่อติดต่อกลับและยืนยันรายละเอียดสินค้า"
                    : "Our team will use these details to confirm items and reply to your request."}
                </p>
              </div>

              <div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder={isThai ? "ชื่อผู้ติดต่อ" : "Contact name"}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    {t("phone")}
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder={isThai ? "เบอร์โทรศัพท์" : "Phone number"}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    {t("lineId")}
                  </label>
                  <input
                    type="text"
                    value={form.lineId}
                    onChange={(e) => update("lineId", e.target.value)}
                    placeholder={isThai ? "LINE ID (ถ้ามี)" : "LINE ID (optional)"}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder={isThai ? "อีเมล" : "Email"}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    {t("company")}
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder={isThai ? "ชื่อบริษัท" : "Company name"}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                {t("note")}
              </label>
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder={
                  isThai
                    ? "ข้อมูลเพิ่มเติม เช่น การใช้งาน, Specification, Cross Reference เพิ่มเติม หรือ product list หลายรายการ"
                    : "Additional details such as application, extra specs, or other requirements"
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                {t("contactHint")}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isThai
                  ? "ถ้ามี product list หลายตัว ใส่เพิ่มใน Note ได้เลย ไม่ต้องส่งทีละรายการ"
                  : "If you have a longer product list, add it in the note so you do not need to send items one by one."}
              </p>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {successId ? (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <div>{t("success")}</div>
                  <div className="mt-1 font-medium">
                    {isThai ? "เลขอ้างอิง" : "Reference"}: {successId}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isThai ? "ส่งใบขอราคา (RFQ)" : t("submit")}
                </button>

                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-500 bg-emerald-50 px-6 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  {isThai ? "คุยทาง LINE" : "Add LINE"}
                </a>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                {isThai
                  ? "กรอกครบขั้นต่ำแล้วกดส่งได้ทันที ทีมงานจะติดต่อกลับตามช่องทางที่สะดวกที่สุดให้ครับ"
                  : "After submission, our team will follow up through your preferred contact channel."}
              </p>
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">
              {isThai ? "ติดต่อทางลัด" : "Quick Contact"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {isThai
                ? "ถ้าต้องการส่งรูป, product list หรือคุยเรื่อง spec เพิ่ม ใช้ LINE หรือโทรหา team ได้ทันที"
                : "If you want to send photos, a product list, or discuss specs, contact our team directly on LINE or by phone."}
            </p>

            <div className="mt-6 space-y-4">
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:bg-emerald-100"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {isThai ? "คุยทาง LINE" : "Add us on LINE"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {isThai
                      ? "เหมาะสำหรับส่งรายละเอียดสินค้า, รูปสินค้า และคุยกับทีมงานได้เร็ว"
                      : "Best for sending product details and chatting quickly with our team."}
                  </p>
                </div>
              </a>

              <a
                href="tel:+66815581323"
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    +66 81-558-1323
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {isThai
                      ? "โทรสอบถามทีมงานได้โดยตรง"
                      : "Call our team directly."}
                  </p>
                </div>
              </a>

              <a
                href="mailto:sales@mrtsupplier.com"
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    sales@mrtsupplier.com
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {isThai
                      ? "เหมาะสำหรับส่งข้อมูลจัดซื้อ, BOM หรือรายละเอียดงานอย่างเป็นทางการ"
                      : "Recommended for formal procurement details and documentation."}
                  </p>
                </div>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/products`}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
              >
                {isThai ? "กลับไปเลือกสินค้าเพิ่ม" : "Add More Products"}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
