import { test, expect } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/gallery",
  "/blog",
  "/contact",
  "/quote",
  "/privacy",
];

test.describe("public pages", () => {
  for (const route of publicRoutes) {
    test(`loads ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
    });
  }

  test("sitemap, robots, and RSS feed are served", async ({ request }) => {
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
    expect((await request.get("/robots.txt")).status()).toBe(200);
    expect((await request.get("/feed.xml")).status()).toBe(200);
  });
});

test.describe("admin protection", () => {
  test("unauthenticated admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("content API rejects unauthenticated writes", async ({ request }) => {
    const res = await request.post("/api/admin/content", {
      data: { type: "faqs", item: { question: "x", answer: "y" } },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("leads API", () => {
  test("validates required fields", async ({ request }) => {
    const res = await request.post("/api/leads", { data: { name: "" } });
    expect(res.status()).toBe(400);
  });

  test("silently drops honeypot submissions", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { name: "Bot", phone: "123", message: "spam", website: "http://spam" },
    });
    expect(res.status()).toBe(200);
  });
});
