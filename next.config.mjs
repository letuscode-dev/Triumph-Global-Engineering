import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  // Clickjacking + force-HTTPS without breaking inline scripts (JSON-LD, GA).
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; upgrade-insecure-requests",
  },
];

const nextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up a stray parent lockfile.
  turbopack: { root: projectRoot },
  images: {
    // Only optimise images from trusted hosts. Allowing arbitrary hosts here
    // exposes the Image Optimizer to abuse (GHSA-9g9p-9gw9-jx7f). CMS-pasted
    // URLs from other hosts are rendered un-optimised via <SafeImage/>.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Never index the admin area or APIs.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
