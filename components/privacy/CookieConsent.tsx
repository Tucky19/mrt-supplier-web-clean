"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mrt_cookie_consent";
type ConsentChoice = "accepted" | "rejected";

function updateGoogleConsent(choice: ConsentChoice) {
  const value = choice === "accepted" ? "granted" : "denied";
  const win = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  win.dataLayer = win.dataLayer || [];
  const update = {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  };

  if (typeof win.gtag === "function") {
    win.gtag("consent", "update", update);
  } else {
    win.dataLayer.push(["consent", "update", update]);
  }

  win.dataLayer.push({ event: "consent_update", consent_choice: choice });
}

export default function CookieConsent({ locale }: { locale: string }) {
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);
  const isThai = locale === "th";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      setChoice(stored === "accepted" || stored === "rejected" ? stored : null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function save(nextChoice: ConsentChoice) {
    localStorage.setItem(STORAGE_KEY, nextChoice);
    updateGoogleConsent(nextChoice);
    setChoice(nextChoice);
  }

  if (choice === undefined) return null;

  if (choice !== null) {
    return (
      <button
        type="button"
        onClick={() => setChoice(null)}
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-3 z-50 rounded-full border border-slate-300 bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-md backdrop-blur hover:bg-slate-50 md:bottom-3"
      >
        {isThai ? "ตั้งค่าคุกกี้" : "Cookie settings"}
      </button>
    );
  }

  return (
    <section
      aria-label={isThai ? "การตั้งค่าคุกกี้" : "Cookie preferences"}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-slate-300 bg-white p-4 shadow-2xl sm:p-5"
    >
      <h2 className="text-base font-semibold text-slate-950">
        {isThai ? "การใช้คุกกี้บนเว็บไซต์" : "Cookies on this website"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isThai
          ? "เราใช้คุกกี้ที่จำเป็นต่อการทำงาน และขออนุญาตใช้ข้อมูลการวิเคราะห์และการตลาดเพื่อปรับปรุงเว็บไซต์และวัดผลการหาลูกค้าใหม่"
          : "We use essential technology and ask permission to use analytics and advertising measurement data to improve the website and measure new-customer acquisition."}{" "}
        <Link href={`/${locale}/privacy`} className="font-medium text-sky-700 underline">
          {isThai ? "อ่านนโยบายความเป็นส่วนตัว" : "Read the Privacy Policy"}
        </Link>
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => save("rejected")}
          className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {isThai ? "ปฏิเสธคุกกี้วิเคราะห์/การตลาด" : "Reject analytics/ads"}
        </button>
        <button
          type="button"
          onClick={() => save("accepted")}
          className="min-h-11 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {isThai ? "ยอมรับ" : "Accept"}
        </button>
      </div>
    </section>
  );
}
