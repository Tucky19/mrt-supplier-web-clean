"use client";

import { useState } from "react";

type ReplyTemplate = {
  id: string;
  title: string;
  body: string;
};

type Props = {
  requestTypeLabel: string;
  suggestedStatusLabel: string;
  templates: ReplyTemplate[];
  showNoteHint?: boolean;
};

export default function MissingProductRequestFollowUpHelper({
  requestTypeLabel,
  suggestedStatusLabel,
  templates,
  showNoteHint = false,
}: Props) {
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  async function copyTemplate(template: ReplyTemplate) {
    try {
      await navigator.clipboard.writeText(template.body);
      setCopiedTemplateId(template.id);
      window.setTimeout(() => setCopiedTemplateId(null), 1500);
    } catch {
      setCopiedTemplateId(null);
    }
  }

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">
        Missing Product Request Follow-up Helper
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        ใช้ข้อความตัวอย่างด้านล่างเพื่อช่วยตอบกลับลูกค้าอย่างรวดเร็ว โดยยังไม่ส่งอัตโนมัติในรอบนี้
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Request Type
          </p>
          <p className="mt-2 text-sm text-slate-900">{requestTypeLabel}</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Current Suggested Status
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            {suggestedStatusLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {templates.map((template) => {
          const copied = copiedTemplateId === template.id;

          return (
            <div
              key={template.id}
              className="rounded-2xl border border-amber-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {template.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyTemplate(template)}
                  className="inline-flex shrink-0 rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <pre className="mt-3 whitespace-pre-wrap break-words rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-800">
                {template.body}
              </pre>
            </div>
          );
        })}
      </div>

      {showNoteHint ? (
        <p className="mt-5 text-sm leading-6 text-slate-600">
          หลังตอบกลับลูกค้าแล้ว สามารถบันทึก note ในระบบเพื่อติดตามงานต่อได้
        </p>
      ) : null}
    </div>
  );
}
