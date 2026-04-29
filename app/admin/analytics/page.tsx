"use client";

import { useEffect, useState } from "react";

type Event = {
  name: string;
  payload: any;
};

export default function AnalyticsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("analytics") || "[]");
    setEvents(data);
  }, []);

  // 🔥 helper
  const countBy = (key: string, field: string) => {
    const map: Record<string, number> = {};

    events
      .filter((e) => e.name === key)
      .forEach((e) => {
        const val = e.payload?.[field];
        if (!val) return;
        map[val] = (map[val] || 0) + 1;
      });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  const topSearch = countBy("search", "query");
  const topClick = countBy("select_result", "partNo");
  const topQuote = countBy("add_to_quote", "partNo");

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

      {/* 🔍 Top Searches */}
      <div>
        <h2 className="font-medium mb-2">Top Searches</h2>
        {topSearch.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b py-1">
            <span>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* 👆 Click */}
      <div>
        <h2 className="font-medium mb-2">Top Clicked Products</h2>
        {topClick.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b py-1">
            <span>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* 🧾 RFQ */}
      <div>
        <h2 className="font-medium mb-2">Top RFQ Products</h2>
        {topQuote.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b py-1">
            <span>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* 🔥 Funnel */}
      <div>
        <h2 className="font-medium mb-2">Funnel</h2>
        <div className="space-y-1 text-sm">
          <div>Search: {events.filter(e => e.name === "search").length}</div>
          <div>Click: {events.filter(e => e.name === "select_result").length}</div>
          <div>View: {events.filter(e => e.name === "view_product").length}</div>
          <div>Add: {events.filter(e => e.name === "add_to_quote").length}</div>
          <div>RFQ: {events.filter(e => e.name === "submit_rfq").length}</div>
        </div>
      </div>
    </div>
  );
}