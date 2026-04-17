import * as React from "react";
import Card from "@/components/ui/Card";

export type SpecRow = {
  label: string;
  value: string;
};

type Props = {
  title?: string;
  rows: SpecRow[];
};

export default function SpecsTable({
  title = "Specifications",
  rows,
}: Props) {
  if (!rows?.length) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <div className="mt-4 divide-y divide-neutral-800">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 py-3"
          >
            <span className="text-sm text-neutral-400">
              {row.label}
            </span>
            <span className="text-sm font-medium text-white text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}