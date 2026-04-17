"use client";

import { useSearchParams } from "next/navigation";

export default function RFQsClient() {
  const sp = useSearchParams();
  const status = sp.get("status") || "";

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">RFQ Admin</h1>
      {status ? (
        <p className="mt-2 text-sm text-neutral-600">Filter status: {status}</p>
      ) : (
        <p className="mt-2 text-sm text-neutral-600">No filter</p>
      )}
    </div>
  );
}