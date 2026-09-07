import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * DELEBILLEDE (Open Graph)
 * ------------------------------------------------
 * Dette billede vises automatisk som forhåndsvisning, når linket til
 * hjemmesiden deles på f.eks. Snapchat, Instagram, Facebook eller SMS.
 * Billedet laves automatisk ud fra koden herunder – du skal ikke
 * uploade noget. Ret teksten/farverne her, hvis du vil ændre det.
 */

export const alt = `${siteConfig.name} – ${siteConfig.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1220 0%, #0a5852 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: "rgba(51, 194, 178, 0.25)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: 360,
            background: "rgba(20, 167, 154, 0.18)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "#33c2b2",
              color: "#0b1220",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#ffffff" }}>
            {siteConfig.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            marginTop: 48,
          }}
        >
          Giv din bil en frisk start.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#9cebde",
            marginTop: 28,
          }}
        >
          Professionel indvendig bilrengøring
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 44,
            padding: "16px 32px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            fontSize: 28,
            alignSelf: "flex-start",
          }}
        >
          {siteConfig.serviceArea}
        </div>
      </div>
    ),
    size
  );
}
