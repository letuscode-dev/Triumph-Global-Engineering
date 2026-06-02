import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { detectMediaKind } from "@/lib/sanitize";

const BUCKET = "media";
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

// Uploads a file to Supabase Storage and returns its public URL.
// Protected by proxy.ts (only authenticated admins reach /api/admin/*).
export async function POST(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Storage is not configured. Add Supabase keys to enable uploads." },
      { status: 503 }
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Only image and video files are allowed." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 50 MB)." },
      { status: 413 }
    );
  }

  const ext = file.name.includes(".")
    ? file.name.split(".").pop()
    : isVideo
      ? "mp4"
      : "jpg";
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const path = `${Date.now()}-${safe || "upload"}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = detectMediaKind(buffer);
  if (!kind) {
    return NextResponse.json(
      { error: "Unrecognised file type. Upload JPG, PNG, GIF, WebP, or MP4 only." },
      { status: 415 }
    );
  }
  if (kind === "image" && !isImage) {
    return NextResponse.json({ error: "File content does not match an image." }, { status: 415 });
  }
  if (kind === "video" && !isVideo) {
    return NextResponse.json({ error: "File content does not match a video." }, { status: 415 });
  }

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
