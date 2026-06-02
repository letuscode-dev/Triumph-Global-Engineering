"use client";

import { SafeImage as Image } from "@/components/SafeImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import type { MediaItem, ServiceCategory } from "@/lib/types";
import { useFocusTrap } from "@/lib/use-focus-trap";

const FILTERS: { key: ServiceCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "borehole", label: "Borehole" },
  { key: "irrigation", label: "Irrigation" },
  { key: "solar", label: "Solar" },
  { key: "water", label: "Water" },
];

export function GalleryGrid({ items }: { items: MediaItem[] }) {
  const [active, setActive] = useState<ServiceCategory | "all">("all");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, Boolean(lightbox));

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((i) => i.category === active)),
    [active, items]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            aria-pressed={active === f.key}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === f.key
                ? "bg-brand-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="masonry mt-10 columns-2 md:columns-3 lg:columns-4">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(item)}
            aria-label={`View ${item.caption || "gallery image"}`}
            className="group block w-full overflow-hidden rounded-xl"
          >
            <span className="relative block">
              <Image
                src={item.src}
                alt={item.caption}
                width={600}
                height={800}
                className="w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-slate-900/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-medium text-white">{item.caption}</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.caption}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.src}
              alt={lightbox.caption}
              width={1200}
              height={900}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-slate-200">
              {lightbox.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
