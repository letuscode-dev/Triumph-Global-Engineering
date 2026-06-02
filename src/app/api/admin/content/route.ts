import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { ContentType } from "@/lib/content-store";
import { deleteContent, saveContent } from "@/lib/repository";

const TYPES: ContentType[] = [
  "projects",
  "services",
  "blog",
  "testimonials",
  "faqs",
  "media",
];

const REVALIDATE_PATHS: Record<ContentType, string[]> = {
  projects: ["/", "/projects"],
  services: ["/", "/services"],
  blog: ["/", "/blog"],
  testimonials: ["/"],
  faqs: ["/", "/contact"],
  media: ["/", "/gallery"],
};

function revalidateFor(type: ContentType) {
  for (const path of REVALIDATE_PATHS[type] ?? []) {
    revalidatePath(path);
  }
  if (type === "services") revalidatePath("/services/[slug]", "page");
  if (type === "blog") revalidatePath("/blog/[slug]", "page");
  if (type === "projects") revalidatePath("/projects/[slug]", "page");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { type, item } = body as { type: ContentType; item: Record<string, unknown> };
  if (!TYPES.includes(type) || !item) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const result = await saveContent(type, item);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Save failed." }, { status: 500 });
  }
  revalidateFor(type);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { type, id } = body as { type: ContentType; id: string };
  if (!TYPES.includes(type) || !id) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const result = await deleteContent(type, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Delete failed." }, { status: 500 });
  }
  revalidateFor(type);
  return NextResponse.json({ ok: true });
}
