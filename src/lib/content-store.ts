// In-memory CMS store for the admin dashboard demo. Seeded from the site
// content so the dashboard is populated out of the box. Changes persist for the
// life of the server process. For permanent storage, connect Supabase tables
// (see supabase/schema.sql) and swap these functions to query the database.

import { BLOG_POSTS, FAQS, MEDIA, PROJECTS, SERVICES, TESTIMONIALS } from "./content";
import type { BlogPost, Faq, MediaItem, Project, Service, Testimonial } from "./types";

export type ContentType =
  | "projects"
  | "services"
  | "blog"
  | "testimonials"
  | "faqs"
  | "media";

interface Store {
  projects: Project[];
  services: Service[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  faqs: Faq[];
  media: MediaItem[];
}

// Use a global to survive hot-reloads in dev.
const g = globalThis as unknown as { __tgeStore?: Store };

function seed(): Store {
  return {
    projects: structuredClone(PROJECTS),
    services: structuredClone(SERVICES),
    blog: structuredClone(BLOG_POSTS),
    testimonials: structuredClone(TESTIMONIALS),
    faqs: structuredClone(FAQS),
    media: structuredClone(MEDIA),
  };
}

function store(): Store {
  if (!g.__tgeStore) g.__tgeStore = seed();
  return g.__tgeStore;
}

export function list<T = unknown>(type: ContentType): T[] {
  return store()[type] as unknown as T[];
}

function keyOf(type: ContentType, item: Record<string, unknown>): string {
  if (type === "faqs") return String(item.question);
  if (type === "media") return String(item.id);
  if (type === "projects" || type === "testimonials") return String(item.id);
  return String(item.slug); // services, blog
}

export function upsert(type: ContentType, item: Record<string, unknown>) {
  const arr = store()[type] as unknown as Record<string, unknown>[];
  const id = keyOf(type, item);
  const idField =
    type === "faqs" ? "question" : type === "services" || type === "blog" ? "slug" : "id";
  const idx = arr.findIndex((x) => String(x[idField]) === id);
  if (idx >= 0) arr[idx] = { ...arr[idx], ...item };
  else arr.unshift(item);
  return item;
}

export function remove(type: ContentType, id: string) {
  const arr = store()[type] as unknown as Record<string, unknown>[];
  const idField =
    type === "faqs" ? "question" : type === "services" || type === "blog" ? "slug" : "id";
  const next = arr.filter((x) => String(x[idField]) !== id);
  (store() as unknown as Record<string, unknown[]>)[type] = next;
}

export function counts() {
  const s = store();
  return {
    projects: s.projects.length,
    services: s.services.length,
    blog: s.blog.length,
    testimonials: s.testimonials.length,
    faqs: s.faqs.length,
    media: s.media.length,
  };
}
