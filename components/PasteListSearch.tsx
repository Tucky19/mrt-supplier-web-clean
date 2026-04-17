"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasteListSearch() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  function parseList(input: string): string[] {
    return input
      .split(/[\n, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function handleSearch() {
    const list = parseList(text);

    if (list.length === 0) return;

    const q = list.join(",");

    router.push(`/products?q=${encodeURIComponent(q)}`);

    setOpen(false);
  }

  return (
    <>
      {/* button */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-neutral-600 px-4 py-2 text-sm hover:border-red-500 hover:text-red-400"
      >
        Paste List
      </button>

      {/* popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">

            <div className="mb-3 text-lg font-semibold">
              Paste multiple part numbers
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`P550388
P551381
WK1144
6205ZZ`}
              className="h-48 w-full rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-sm outline-none focus:border-red-500"
            />

            <div className="mt-4 flex justify-end gap-2">

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSearch}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
              >
                Search All
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
