"use client";

import { useState } from "react";
import { Loader2, Trash2, UploadCloud, Video } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { isUploadConfigured, uploadMedia } from "@/lib/upload";

const CATEGORIES = ["borehole", "irrigation", "solar", "water"] as const;

export function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<{ name: string; pct: number }[]>([]);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("borehole");
  const [error, setError] = useState("");

  async function persist(item: MediaItem): Promise<boolean> {
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "media", item }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(
        typeof data.error === "string" && data.error
          ? `Uploaded ${item.caption} but could not save: ${data.error}`
          : `Uploaded ${item.caption} but could not save to the database.`
      );
      return false;
    }
    return true;
  }

  async function handleFiles(files: FileList | File[]) {
    setError("");
    if (!isUploadConfigured) {
      setError(
        "Uploads are not configured. Connect Supabase to enable media uploads."
      );
      return;
    }
    const arr = Array.from(files);
    for (const file of arr) {
      const label = file.name;
      setUploading((u) => [...u, { name: label, pct: 0 }]);
      try {
        const url = await uploadMedia(file, (pct) =>
          setUploading((u) => u.map((x) => (x.name === label ? { ...x, pct } : x)))
        );
        const item: MediaItem = {
          id: crypto.randomUUID(),
          type: file.type.startsWith("video") ? "video" : "image",
          src: url,
          caption: file.name.replace(/\.[^.]+$/, ""),
          category,
        };
        const saved = await persist(item);
        if (!saved) continue;
        setItems((prev) => [item, ...prev]);
      } catch (e) {
        setError(e instanceof Error ? e.message : `Failed to upload ${label}.`);
      } finally {
        setUploading((u) => u.filter((x) => x.name !== label));
      }
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this media item?")) return;
    const res = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "media", id }),
    });
    if (!res.ok) {
      setError("Could not delete this item.");
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Upload category:</span>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
              category === c ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-brand-400"
        }`}
      >
        <UploadCloud className="h-10 w-10 text-brand-500" />
        <p className="mt-3 font-semibold text-slate-700">
          Drag &amp; drop images or videos here
        </p>
        <p className="text-sm text-slate-500">
          or click to browse · bulk upload supported
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          {error}
        </p>
      )}

      {uploading.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploading.map((u) => (
            <div key={u.name} className="flex items-center gap-3 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
              <span className="flex-1 truncate">{u.name}</span>
              <span>{u.pct}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="card group relative overflow-hidden">
            {m.type === "video" ? (
              <div className="flex h-32 w-full items-center justify-center bg-slate-800 text-white">
                <Video className="h-8 w-8" />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.src} alt={m.caption} className="h-32 w-full object-cover" />
            )}
            <div className="p-2.5">
              <p className="truncate text-xs font-medium text-slate-700">{m.caption}</p>
              <p className="text-[10px] uppercase text-slate-400">{m.category}</p>
            </div>
            <button
              type="button"
              onClick={() => del(m.id)}
              className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
