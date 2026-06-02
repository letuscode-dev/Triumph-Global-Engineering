import { describe, expect, it } from "vitest";
import { escapeHtml, detectMediaKind } from "@/lib/sanitize";
import { leadInputSchema, parseJsonBody } from "@/lib/validation";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<script>"'&"</script>`)).toBe(
      "&lt;script&gt;&quot;&#39;&amp;&quot;&lt;/script&gt;"
    );
  });
});

describe("detectMediaKind", () => {
  it("detects PNG magic bytes", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    expect(detectMediaKind(png)).toBe("image");
  });

  it("rejects unknown content", () => {
    expect(detectMediaKind(Buffer.from("hello world"))).toBeNull();
  });
});

describe("leadInputSchema", () => {
  it("accepts valid lead input", () => {
    const result = parseJsonBody(leadInputSchema, {
      name: "Tatenda Sibanda",
      phone: "0779 651 626",
      message: "Need a borehole quote.",
      email: "test@example.com",
      source: "quote",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects missing phone", () => {
    const result = parseJsonBody(leadInputSchema, {
      name: "Test",
      phone: "12",
      message: "Hello",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = parseJsonBody(leadInputSchema, {
      name: "Test",
      phone: "0779651626",
      message: "Hello",
      email: "not-an-email",
    });
    expect(result.ok).toBe(false);
  });

  it("allows empty email", () => {
    const result = parseJsonBody(leadInputSchema, {
      name: "Test",
      phone: "0779651626",
      message: "Hello",
      email: "",
    });
    expect(result.ok).toBe(true);
  });
});
