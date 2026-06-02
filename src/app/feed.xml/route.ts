import { SITE } from "@/lib/site";
import { getPosts } from "@/lib/repository";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map(
      (p) => `<item>
  <title>${escapeXml(p.title)}</title>
  <link>${SITE.url}/blog/${p.slug}</link>
  <guid isPermaLink="true">${SITE.url}/blog/${p.slug}</guid>
  <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
  <description>${escapeXml(p.excerpt)}</description>
</item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE.name)} Blog</title>
  <link>${SITE.url}/blog</link>
  <description>${escapeXml(SITE.description)}</description>
  <language>en-zw</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
