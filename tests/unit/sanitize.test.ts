import { describe, expect, it } from "vitest";
import { safeAdminRedirect } from "@/lib/sanitize";

describe("safeAdminRedirect", () => {
  it("allows internal admin paths", () => {
    expect(safeAdminRedirect("/admin/leads")).toBe("/admin/leads");
  });

  it("blocks open redirects", () => {
    expect(safeAdminRedirect("//evil.com")).toBe("/admin");
    expect(safeAdminRedirect("https://evil.com/admin")).toBe("/admin");
  });

  it("defaults when empty", () => {
    expect(safeAdminRedirect(null)).toBe("/admin");
  });
});
