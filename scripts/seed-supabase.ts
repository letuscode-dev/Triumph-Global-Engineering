/**
 * One-time Supabase content seeder.
 *
 * Populates the content tables with the bundled starter content so the live
 * site shows data (and the items become editable in the admin CMS).
 *
 * Run with:
 *   npx tsx --env-file=.env.local scripts/seed-supabase.ts
 *
 * Safe to re-run: each table is cleared and re-seeded.
 */
import { createClient } from "@supabase/supabase-js";
import {
  SERVICES,
  PROJECTS,
  BLOG_POSTS,
  TESTIMONIALS,
  FAQS,
  MEDIA,
} from "../src/lib/content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Run with: npx tsx --env-file=.env.local scripts/seed-supabase.ts"
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

const serviceRows = SERVICES.map((s) => ({
  slug: s.slug,
  title: s.title,
  short_title: s.shortTitle,
  category: s.category,
  icon: s.icon,
  excerpt: s.excerpt,
  description: s.description,
  benefits: s.benefits ?? [],
  process: s.process ?? [],
  image: s.image,
  gallery: s.gallery ?? [],
  keywords: s.keywords ?? [],
}));

// UUID primary key — drop the seed id and let the DB generate one.
const projectRows = PROJECTS.map((p) => ({
  title: p.title,
  slug: p.slug,
  category: p.category,
  service_type: p.serviceType,
  location: p.location,
  completed_at: p.completedAt || null,
  description: p.description,
  cover: p.cover,
  images: p.images ?? [],
  video: p.video || null,
  before_image: p.beforeImage || null,
  after_image: p.afterImage || null,
  featured: Boolean(p.featured),
}));

const blogRows = BLOG_POSTS.map((b) => ({
  slug: b.slug,
  title: b.title,
  category: b.category,
  excerpt: b.excerpt,
  content: b.content,
  cover: b.cover,
  author: b.author,
  published_at: b.publishedAt || new Date().toISOString(),
  read_minutes: Number(b.readMinutes ?? 4),
}));

const testimonialRows = TESTIMONIALS.map((t) => ({
  name: t.name,
  role: t.role,
  location: t.location,
  rating: Number(t.rating ?? 5),
  quote: t.quote,
}));

const faqRows = FAQS.map((f) => ({
  question: f.question,
  answer: f.answer,
}));

const mediaRows = MEDIA.map((m) => ({
  type: m.type ?? "image",
  src: m.src,
  caption: m.caption,
  category: m.category,
}));

async function reseed(table: string, rows: Record<string, unknown>[]): Promise<void> {
  // Clear existing rows (filter on created_at, which every table has).
  const del = await supabase.from(table).delete().gte("created_at", "1900-01-01");
  if (del.error) {
    console.error(`  ! delete from ${table} failed:`, del.error.message);
    return;
  }
  const ins = await supabase.from(table).insert(rows);
  if (ins.error) {
    console.error(`  ! insert into ${table} failed:`, ins.error.message);
    return;
  }
  console.log(`  ✓ ${table}: seeded ${rows.length} rows`);
}

async function main() {
  console.log("Seeding Supabase content tables...");
  await reseed("services", serviceRows);
  await reseed("projects", projectRows);
  await reseed("blog_posts", blogRows);
  await reseed("testimonials", testimonialRows);
  await reseed("faqs", faqRows);
  await reseed("media", mediaRows);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
