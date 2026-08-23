import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <svg width="152" height="152" viewBox="0 0 100 100">
          <path
            d="M28 13A42 42 0 0 0 19 76"
            fill="none"
            stroke="#08265f"
            strokeWidth="9"
          />
          <path
            d="M72 13a42 42 0 0 1 10 16"
            fill="none"
            stroke="#155EEF"
            strokeWidth="9"
          />
          <path
            d="M84 34a42 42 0 0 1-3 43"
            fill="none"
            stroke="#08265f"
            strokeWidth="9"
          />
          <path
            d="M23 31 50 54 77 31v53l-11 7V55L50 69 34 55v36l-11-7Z"
            fill="#08265f"
          />
        </svg>
      </div>
    ),
    size,
  );
}
