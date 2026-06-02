/** Escape text for safe insertion into HTML (emails, etc.). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Only allow internal admin redirects after login. */
export function safeAdminRedirect(from: string | null | undefined): string {
  if (!from || !from.startsWith("/admin")) return "/admin";
  if (from.startsWith("//") || from.includes("://")) return "/admin";
  return from;
}

/** Basic magic-byte checks for uploads (don't trust client MIME alone). */
export function detectMediaKind(buffer: Buffer): "image" | "video" | null {
  if (buffer.length < 12) return null;

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image";
  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  )
    return "image";
  // GIF
  if (buffer.subarray(0, 3).toString("ascii") === "GIF") return "image";
  // WebP (RIFF....WEBP)
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return "image";
  // MP4 (ftyp)
  if (buffer.subarray(4, 8).toString("ascii") === "ftyp") return "video";

  return null;
}
