// components/layout/AppBackground.tsx
import React from "react";

export default function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0b1020] text-white">
      {/* gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_20%,rgba(59,130,246,0.25),transparent_55%),radial-gradient(900px_circle_at_80%_0%,rgba(14,165,233,0.18),transparent_55%),radial-gradient(900px_circle_at_50%_100%,rgba(239,68,68,0.12),transparent_55%)]" />
      {/* grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative">{children}</div>
    </div>
  );
}