import { createOgShell } from "@/lib/og/shared";

export function OgBrand({
  name,
  subtitle,
  locale,
}: {
  name: string;
  subtitle: string;
  locale: string;
}) {
  const badgeText =
    locale === "th" ? "แบรนด์หลักที่เราจัดหา" : "Featured Brand";

  const footerText =
    locale === "th"
      ? "Industrial Parts • Brand Page • Request for Quotation"
      : "Industrial Parts • Brand Page • Request for Quotation";

  return createOgShell(
    <>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9999,
                background: "#38bdf8",
              }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              MRT Supplier
            </div>
          </div>

          <div
            style={{
              borderRadius: 9999,
              padding: "10px 18px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.26)",
              color: "#bae6fd",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {badgeText}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 12,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -2.5,
              color: "#ffffff",
            }}
          >
            {name}
          </div>

          <div
            style={{
              fontSize: 30,
              color: "#cbd5e1",
              fontWeight: 500,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 600 }}>
            Industrial Parts • Search-first B2B Platform
          </div>
          <div style={{ fontSize: 18, color: "#94a3b8" }}>
            {footerText}
          </div>
        </div>

        <div style={{ fontSize: 20, color: "#bae6fd", fontWeight: 700 }}>
          mrtsupplier.com
        </div>
      </div>
    </>
  );
}