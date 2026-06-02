"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { ContentType } from "@/lib/content-store";
import { ImageInput } from "./ImageInput";
import { useFocusTrap } from "@/lib/use-focus-trap";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "image"
  | "video"
  | "tags";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  half?: boolean;
}

type Item = Record<string, unknown>;

export function ContentManager({
  type,
  idField,
  fields,
  initialItems,
  titleField,
  subtitleField,
  imageField,
}: {
  type: ContentType;
  idField: string;
  fields: Field[];
  initialItems: Item[];
  titleField: string;
  subtitleField?: string;
  imageField?: string;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editing, setEditing] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, Boolean(editing));

  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditing(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editing]);

  function startNew() {
    const blank: Item = {};
    fields.forEach((f) => {
      blank[f.name] = f.type === "checkbox" ? false : f.type === "number" ? 0 : "";
    });
    setEditing(blank);
  }

  function setField(name: string, value: unknown) {
    setEditing((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");

    const item = { ...editing };
    // Generate id/slug for new items if missing.
    if (!item[idField]) {
      if (idField === "slug") {
        item.slug = String(item[titleField] || "item")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      } else {
        item[idField] = `${type}-${Date.now()}`;
      }
    }
    // Normalise tags fields from comma string to array.
    fields.forEach((f) => {
      if (f.type === "tags" && typeof item[f.name] === "string") {
        item[f.name] = String(item[f.name])
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    });

    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, item }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(String(data.error || "Save failed. Please try again."));
      setSaving(false);
      return;
    }

    setItems((prev) => {
      const idx = prev.findIndex((x) => x[idField] === item[idField]);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
    setEditing(null);
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const res = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(String(data.error || "Delete failed."));
      return;
    }
    setItems((prev) => prev.filter((x) => String(x[idField]) !== id));
  }

  function editValue(f: Field): string {
    const v = editing?.[f.name];
    if (f.type === "tags" && Array.isArray(v)) return v.join(", ");
    return v === undefined || v === null ? "" : String(v);
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button type="button" onClick={startNew} className="btn-primary py-2.5">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={String(item[idField])} className="card overflow-hidden">
            {imageField && item[imageField] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={String(item[imageField])}
                alt=""
                className="h-36 w-full object-cover"
              />
            ) : null}
            <div className="p-4">
              <h3 className="line-clamp-2 font-display font-bold text-slate-900">
                {String(item[titleField] || "Untitled")}
              </h3>
              {subtitleField && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {String(item[subtitleField] || "")}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing({ ...item })}
                  className="btn-outline flex-1 py-1.5 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => del(String(item[idField]))}
                  className="rounded-lg border-2 border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-400">
          No items yet. Click &quot;Add New&quot; to create one.
        </p>
      )}

      {/* Editor modal */}
      {editing && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {editing[idField] ? "Edit" : "Add New"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid max-h-[70vh] gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.half ? "sm:col-span-1" : "sm:col-span-2"}>
                  <label className="label">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={4}
                      value={editValue(f)}
                      onChange={(e) => setField(f.name, e.target.value)}
                      className="input resize-y"
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={editValue(f)}
                      onChange={(e) => setField(f.name, e.target.value)}
                      className="input"
                    >
                      <option value="">Select...</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(editing[f.name])}
                        onChange={(e) => setField(f.name, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      Yes
                    </label>
                  ) : f.type === "image" || f.type === "video" ? (
                    <ImageInput
                      value={editValue(f)}
                      onChange={(url) => setField(f.name, url)}
                      accept={f.type === "video" ? "video/*" : "image/*"}
                    />
                  ) : (
                    <input
                      type={
                        f.type === "number"
                          ? "number"
                          : f.type === "date"
                            ? "date"
                            : "text"
                      }
                      value={editValue(f)}
                      onChange={(e) =>
                        setField(
                          f.name,
                          f.type === "number" ? Number(e.target.value) : e.target.value
                        )
                      }
                      className="input"
                    />
                  )}
                  {f.type === "tags" && (
                    <p className="mt-1 text-xs text-slate-400">Separate with commas</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="btn-primary disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
