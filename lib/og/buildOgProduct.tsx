import { createOgShell } from "@/lib/og/shared";

export function OgProduct({
  partNo,
  brand,
  category,
  title,
  locale,
}: {
  partNo: string;
  brand: string;
  category: string;
  title: string;
  locale: string;
}) {
  const badgeText = locale === "th" ? "พร้อมส่งขอราคา" : "RFQ Ready";
  const footerText =
    locale === "th"
      ? "Search • Product Detail • Request for Quotation"
      : "Search • Product Detail • Request for Quotation";

  return createOgShell(
    <>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9999,
                background: "#38bdf8",
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              MRT Supplier
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
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
            alignItems: "center",
            gap: 12,
            color: "#cbd5e1",
            fontSize: 20,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              borderRadius: 9999,
              padding: "8px 14px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {brand}
          </div>

          <div
            style={{
              display: "flex",
              borderRadius: 9999,
              padding: "8px 14px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 8,
            maxWidth: 920,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#ffffff",
            }}
          >
            {partNo}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              color: "#cbd5e1",
              fontWeight: 500,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#e2e8f0",
              fontWeight: 600,
            }}
          >
            Industrial Parts • Search-first B2B Platform
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            {footerText}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#bae6fd",
              fontWeight: 700,
            }}
          >
            mrtsupplier.com
          </div>
        </div>
      </div>
    </>
  );
}