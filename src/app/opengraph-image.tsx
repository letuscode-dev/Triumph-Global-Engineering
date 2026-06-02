import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Og() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #1d5fd8 0%, #16a34a 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 34, opacity: 0.9, letterSpacing: 4 }}>
        TRIUMPH GLOBAL ENGINEERING
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          marginTop: 24,
          lineHeight: 1.1,
          maxWidth: 900,
        }}
      >
        Borehole Drilling, Irrigation & Solar in Zimbabwe
      </div>
      <div style={{ fontSize: 32, marginTop: 40, opacity: 0.95 }}>
        0779 651 626 · 0782 553 213
      </div>
    </div>,
    { ...size }
  );
}
