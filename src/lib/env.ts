/** Validates required production environment variables at startup. */
export function validateProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") return;
  // Next.js sets this during `next build` — validate only at runtime.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const missing: string[] = [];

  if (!process.env.ADMIN_SESSION_TOKEN?.trim()) {
    missing.push("ADMIN_SESSION_TOKEN");
  }
  if (
    !process.env.NEXT_PUBLIC_SITE_URL?.trim() &&
    !process.env.VERCEL_URL?.trim()
  ) {
    missing.push("NEXT_PUBLIC_SITE_URL (optional on Vercel — uses *.vercel.app until you add a domain)");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password || password === "triumph-admin") {
    missing.push("ADMIN_PASSWORD (must be set to a strong, non-default value)");
  }

  if (missing.length > 0) {
    throw new Error(
      `Production environment misconfigured. Set: ${missing.join(", ")}. See PRODUCTION.md.`
    );
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn(
      "[env] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting falls back to in-memory (weak on serverless)."
    );
  }
}
