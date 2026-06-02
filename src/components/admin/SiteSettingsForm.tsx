"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { SiteConfig } from "@/lib/site";

export function SiteSettingsForm({ initial }: { initial: SiteConfig }) {
  const [form, setForm] = useState({
    name: initial.name,
    shortName: initial.shortName,
    slogan: initial.slogan,
    description: initial.description,
    email: initial.email,
    phones: initial.phones.join("\n"),
    phoneIntl: initial.phoneIntl.join("\n"),
    whatsapp: initial.whatsapp,
    address: initial.address,
    facebook: initial.socials.facebook,
    linkedin: initial.socials.linkedin,
    youtube: initial.socials.youtube,
    hours: initial.hours.map((h) => `${h.day}|${h.time}`).join("\n"),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function setField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const phones = form.phones
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const phoneIntl = form.phoneIntl
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const hours = form.hours
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [day, time] = line.split("|");
        return { day: day?.trim() ?? "", time: time?.trim() ?? "" };
      })
      .filter((h) => h.day && h.time);

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          shortName: form.shortName,
          slogan: form.slogan,
          description: form.description,
          email: form.email,
          phones,
          phoneIntl,
          whatsapp: form.whatsapp,
          address: form.address,
          hours,
          socials: {
            facebook: form.facebook,
            linkedin: form.linkedin,
            youtube: form.youtube,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Could not save settings." });
        return;
      }
      setMessage({ type: "ok", text: "Company information saved. Public pages will update shortly." });
    } catch {
      setMessage({ type: "err", text: "Could not save settings." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="site-name">
            Company name
          </label>
          <input
            id="site-name"
            className="input"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="site-short">
            Short name
          </label>
          <input
            id="site-short"
            className="input"
            value={form.shortName}
            onChange={(e) => setField("shortName", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="site-slogan">
          Slogan
        </label>
        <input
          id="site-slogan"
          className="input"
          value={form.slogan}
          onChange={(e) => setField("slogan", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="site-desc">
          Description
        </label>
        <textarea
          id="site-desc"
          className="input resize-y"
          rows={3}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="site-email">
            Email
          </label>
          <input
            id="site-email"
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="site-whatsapp">
            WhatsApp (intl, no +)
          </label>
          <input
            id="site-whatsapp"
            className="input"
            value={form.whatsapp}
            onChange={(e) => setField("whatsapp", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="site-phones">
          Phone numbers (one per line)
        </label>
        <textarea
          id="site-phones"
          className="input resize-y font-mono text-sm"
          rows={2}
          value={form.phones}
          onChange={(e) => setField("phones", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="site-phone-intl">
          International numbers for tel: links (one per line, no +)
        </label>
        <textarea
          id="site-phone-intl"
          className="input resize-y font-mono text-sm"
          rows={2}
          value={form.phoneIntl}
          onChange={(e) => setField("phoneIntl", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="site-address">
          Address
        </label>
        <input
          id="site-address"
          className="input"
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="site-hours">
          Business hours (format: Day|Hours, one per line)
        </label>
        <textarea
          id="site-hours"
          className="input resize-y font-mono text-sm"
          rows={3}
          value={form.hours}
          onChange={(e) => setField("hours", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        <div>
          <label className="label" htmlFor="site-facebook">
            Facebook URL
          </label>
          <input
            id="site-facebook"
            type="url"
            className="input"
            value={form.facebook}
            onChange={(e) => setField("facebook", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="site-linkedin">
            LinkedIn URL
          </label>
          <input
            id="site-linkedin"
            type="url"
            className="input"
            value={form.linkedin}
            onChange={(e) => setField("linkedin", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="site-youtube">
            YouTube URL
          </label>
          <input
            id="site-youtube"
            type="url"
            className="input"
            value={form.youtube}
            onChange={(e) => setField("youtube", e.target.value)}
            required
          />
        </div>
      </div>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "ok" ? "bg-leaf-50 text-leaf-800" : "bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {message.text}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> Save company information
          </>
        )}
      </button>
    </form>
  );
}
