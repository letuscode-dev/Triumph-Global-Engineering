// Unified data-access layer. Reads/writes Supabase when configured, otherwise
// falls back to the in-memory seeded store (demo mode). Server-only — only
// import this from Server Components, route handlers or server actions.

import { createAdminClient } from "./supabase/server";
import {
  counts as memCounts,
  list as memList,
  remove as memRemove,
  upsert as memUpsert,
  type ContentType,
} from "./content-store";
import type { BlogPost, Faq, MediaItem, Project, Service, Testimonial } from "./types";

const TABLE: Record<ContentType, string> = {
  services: "services",
  projects: "projects",
  blog: "blog_posts",
  testimonials: "testimonials",
  faqs: "faqs",
  media: "media",
};

// ---------- row <-> app mappers ----------
function fromService(r: Record<string, unknown>): Service {
  return {
    slug: String(r.slug),
    title: String(r.title ?? ""),
    shortTitle: String(r.short_title ?? r.title ?? ""),
    category: (r.category as Service["category"]) ?? "borehole",
    icon: String(r.icon ?? "Droplets"),
    excerpt: String(r.excerpt ?? ""),
    description: String(r.description ?? ""),
    benefits: (r.benefits as string[]) ?? [],
    process: (r.process as Service["process"]) ?? [],
    image: String(r.image ?? ""),
    gallery: (r.gallery as string[]) ?? [],
    keywords: (r.keywords as string[]) ?? [],
  };
}
function toService(i: Record<string, unknown>) {
  return {
    slug: i.slug,
    title: i.title,
    short_title: i.shortTitle,
    category: i.category,
    icon: i.icon,
    excerpt: i.excerpt,
    description: i.description,
    benefits: i.benefits ?? [],
    process: i.process ?? [],
    image: i.image,
    gallery: i.gallery ?? [],
    keywords: i.keywords ?? [],
  };
}

function fromProject(r: Record<string, unknown>): Project {
  return {
    id: String(r.id),
    title: String(r.title ?? ""),
    slug: String(r.slug ?? r.id),
    category: (r.category as Project["category"]) ?? "borehole",
    serviceType: String(r.service_type ?? ""),
    location: String(r.location ?? ""),
    completedAt: String(r.completed_at ?? new Date().toISOString()),
    description: String(r.description ?? ""),
    cover: String(r.cover ?? ""),
    images: (r.images as string[]) ?? [],
    video: (r.video as string) ?? undefined,
    beforeImage: (r.before_image as string) ?? undefined,
    afterImage: (r.after_image as string) ?? undefined,
    featured: Boolean(r.featured),
  };
}
function toProject(i: Record<string, unknown>) {
  return {
    id: i.id,
    title: i.title,
    slug: i.slug,
    category: i.category,
    service_type: i.serviceType,
    location: i.location,
    completed_at: i.completedAt || null,
    description: i.description,
    cover: i.cover,
    images: i.images ?? [],
    video: i.video || null,
    before_image: i.beforeImage || null,
    after_image: i.afterImage || null,
    featured: Boolean(i.featured),
  };
}

function fromPost(r: Record<string, unknown>): BlogPost {
  return {
    slug: String(r.slug),
    title: String(r.title ?? ""),
    category: String(r.category ?? ""),
    excerpt: String(r.excerpt ?? ""),
    content: String(r.content ?? ""),
    cover: String(r.cover ?? ""),
    author: String(r.author ?? ""),
    publishedAt: String(r.published_at ?? new Date().toISOString()),
    readMinutes: Number(r.read_minutes ?? 4),
  };
}
function toPost(i: Record<string, unknown>) {
  return {
    slug: i.slug,
    title: i.title,
    category: i.category,
    excerpt: i.excerpt,
    content: i.content,
    cover: i.cover,
    author: i.author,
    published_at: i.publishedAt || new Date().toISOString(),
    read_minutes: Number(i.readMinutes ?? 4),
  };
}

function fromTestimonial(r: Record<string, unknown>): Testimonial {
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    role: String(r.role ?? ""),
    location: String(r.location ?? ""),
    rating: Number(r.rating ?? 5),
    quote: String(r.quote ?? ""),
  };
}
function toTestimonial(i: Record<string, unknown>) {
  return {
    id: i.id,
    name: i.name,
    role: i.role,
    location: i.location,
    rating: Number(i.rating ?? 5),
    quote: i.quote,
  };
}

function fromFaq(r: Record<string, unknown>): Faq {
  return { question: String(r.question ?? ""), answer: String(r.answer ?? "") };
}
function fromMedia(r: Record<string, unknown>): MediaItem {
  return {
    id: String(r.id),
    type: (r.type as MediaItem["type"]) ?? "image",
    src: String(r.src ?? ""),
    caption: String(r.caption ?? ""),
    category: (r.category as MediaItem["category"]) ?? "borehole",
  };
}

// ---------- generic helpers ----------
async function fetchAll(type: ContentType): Promise<Record<string, unknown>[]> {
  const supabase = createAdminClient();
  if (supabase) {
    const orderCol =
      type === "blog" ? "published_at" : type === "projects" ? "completed_at" : null;
    const base = supabase.from(TABLE[type]).select("*");
    const { data, error } = await (orderCol
      ? base.order(orderCol, { ascending: false })
      : base);
    if (!error && data) return data as Record<string, unknown>[];
  }
  return memList(type) as unknown as Record<string, unknown>[];
}

// ---------- public getters ----------
export async function getServices(): Promise<Service[]> {
  return (await fetchAll("services")).map(fromService);
}
export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}
export async function getProjects(): Promise<Project[]> {
  return (await fetchAll("projects")).map(fromProject);
}
export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}
export async function getPosts(): Promise<BlogPost[]> {
  return (await fetchAll("blog")).map(fromPost);
}
export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}
export async function getTestimonials(): Promise<Testimonial[]> {
  return (await fetchAll("testimonials")).map(fromTestimonial);
}
export async function getFaqs(): Promise<Faq[]> {
  return (await fetchAll("faqs")).map(fromFaq);
}
export async function getMedia(): Promise<MediaItem[]> {
  return (await fetchAll("media")).map(fromMedia);
}

// ---------- mutations (admin) ----------
function toRow(type: ContentType, item: Record<string, unknown>) {
  switch (type) {
    case "services":
      return toService(item);
    case "projects":
      return toProject(item);
    case "blog":
      return toPost(item);
    case "testimonials":
      return toTestimonial(item);
    case "faqs":
      return { question: item.question, answer: item.answer };
    case "media":
      return {
        id: item.id,
        type: item.type,
        src: item.src,
        caption: item.caption,
        category: item.category,
      };
  }
}

function conflictTarget(type: ContentType): string {
  if (type === "services" || type === "blog") return "slug";
  if (type === "faqs") return "question";
  return "id";
}

export async function saveContent(
  type: ContentType,
  item: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient();
  if (supabase) {
    const row = { ...toRow(type, item), updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from(TABLE[type])
      .upsert(row as Record<string, unknown>, {
        onConflict: conflictTarget(type),
      });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }
  memUpsert(type, item);
  return { ok: true };
}

export async function deleteContent(
  type: ContentType,
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from(TABLE[type]).delete().eq(conflictTarget(type), id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }
  memRemove(type, id);
  return { ok: true };
}

export async function contentCounts() {
  const supabase = createAdminClient();
  if (!supabase) return memCounts();
  const types: ContentType[] = [
    "services",
    "projects",
    "blog",
    "testimonials",
    "faqs",
    "media",
  ];
  const entries = await Promise.all(
    types.map(async (t) => {
      const { count } = await supabase
        .from(TABLE[t])
        .select("*", { count: "exact", head: true });
      return [t, count ?? 0] as const;
    })
  );
  return Object.fromEntries(entries) as Record<ContentType, number>;
}

/** Latest CMS change timestamp for sitemap lastModified. */
export async function getLatestContentModified(): Promise<Date> {
  const dates: Date[] = [];

  const supabase = createAdminClient();
  if (supabase) {
    const tables = [
      "services",
      "projects",
      "blog_posts",
      "testimonials",
      "faqs",
      "media",
      "site_settings",
    ] as const;
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select("updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data?.updated_at) dates.push(new Date(String(data.updated_at)));
    }
  }

  const posts = await getPosts();
  for (const p of posts) dates.push(new Date(p.publishedAt));

  const projects = await getProjects();
  for (const p of projects) {
    if (p.completedAt) dates.push(new Date(p.completedAt));
  }

  if (dates.length === 0) return new Date();
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}
