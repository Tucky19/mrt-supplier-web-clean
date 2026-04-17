import { Suspense } from "react";
import BrandsClient from "./brands-client";

export const dynamic = "force-dynamic";

export default function BrandsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading brands...</div>}>
      <BrandsClient />
    </Suspense>
  );
}