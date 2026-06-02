"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { isUploadConfigured, uploadMedia } from "@/lib/upload";

function isValidImageUrl(value: string): boolean {
  if (!value) return true; // empty is allowed (no warning)
  if (value.startsWith("data:image/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function ImageInput({
  value,
  onChange,
  accept = "image/*",
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (!isUploadConfigured) {
      setError("Uploads not configured — paste an image URL instead.");
      return;
    }
    try {
      setProgress(0);
      const url = await uploadMedia(file, setProgress);
      onChange(url);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Upload failed. Try again or paste a URL."
      );
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload"
          className="input"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-outline shrink-0 py-2"
          disabled={progress !== null}
        >
          {progress !== null ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {progress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Upload
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-amber-600">{error}</p>}
      {!error && !isValidImageUrl(value) && (
        <p className="mt-1 text-xs text-amber-600">
          That doesn&apos;t look like a valid image URL. Use an https link or upload a
          file.
        </p>
      )}
      {value && isValidImageUrl(value) && accept.startsWith("image") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="mt-2 h-24 w-full rounded-lg object-cover"
        />
      )}
    </div>
  );
}
