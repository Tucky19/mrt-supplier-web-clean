"use client";

import MultiPartNumberSearch from "@/components/search/MultiPartNumberSearch";
import { parseBulkPartText } from "@/lib/search/bulkPartInput";

export default function BulkAddToQuote({ locale }: { locale: string }) {
  return <MultiPartNumberSearch locale={locale} initiallyExpanded parseInput={parseBulkPartText} />;
}
