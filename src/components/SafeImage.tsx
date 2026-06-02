import Image, { type ImageProps } from "next/image";

// Hosts we trust the Next.js Image Optimizer to fetch and resize. Must mirror
// the `remotePatterns` allowlist in next.config.mjs.
const OPTIMIZED_HOSTS = [
  /(^|\.)cloudinary\.com$/i,
  /(^|\.)unsplash\.com$/i,
  /(^|\.)supabase\.co$/i,
];

function isOptimizable(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return true; // static import
  if (src.startsWith("/") || src.startsWith("data:")) return true; // local/inline
  try {
    const { hostname } = new URL(src);
    return OPTIMIZED_HOSTS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}

/**
 * Drop-in replacement for next/image that renders CMS-supplied URLs from
 * untrusted hosts as un-optimised images, avoiding both runtime "hostname not
 * configured" crashes and abuse of the Image Optimizer.
 */
export function SafeImage(props: ImageProps) {
  const unoptimized = props.unoptimized ?? !isOptimizable(props.src);
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is forwarded via props
  return <Image {...props} unoptimized={unoptimized} />;
}
