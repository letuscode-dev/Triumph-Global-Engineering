import { describe, expect, it, vi, beforeEach } from "vitest";

describe("validateProductionEnv", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("does nothing in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { validateProductionEnv } = await import("@/lib/env");
    expect(() => validateProductionEnv()).not.toThrow();
  });

  it("throws when required production vars are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_SESSION_TOKEN", "");
    vi.stubEnv("ADMIN_PASSWORD", "triumph-admin");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.resetModules();
    const { validateProductionEnv } = await import("@/lib/env");
    expect(() => validateProductionEnv()).toThrow(/Production environment misconfigured/);
  });
});
