import { Suspense } from "react";
import CatalogClient from "./catalog-client";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading catalog...</div>}>
      <CatalogClient />
    </Suspense>
  );
}