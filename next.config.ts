import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder-billederne i /public/images er SVG-illustrationer.
    // Skifter du til rigtige foto-filer (.jpg/.png), er dette ikke nødvendigt.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
