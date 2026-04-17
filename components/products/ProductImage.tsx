"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
};

export default function ProductImage({ src, alt }: Props) {
  const [error, setError] = useState(false);

  const fallback = "/images/products/fallback-filter.webp";

  const finalSrc = !src || error ? fallback : src;

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className="object-contain p-4"
        onError={() => setError(true)}
      />
    </div>
  );
}