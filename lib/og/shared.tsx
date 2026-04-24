import type { ReactNode } from "react";

export function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}…`;
}

export function createOgShell(children: ReactNode) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e293b 100%)",
        color: "#f8fafc",
        padding: "48px 56px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 34%), radial-gradient(circle at bottom left, rgba(148, 163, 184, 0.14), transparent 28%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 36,
          right: 42,
          width: 220,
          height: 220,
          borderRadius: 9999,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(255,255,255,0.03)",
        }}
      />

      {children}
    </div>
  );
}