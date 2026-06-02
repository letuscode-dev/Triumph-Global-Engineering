"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useServices } from "@/components/ServicesProvider";

const BUDGETS = [
  "Under $1,000",
  "$1,000 – $2,000",
  "$2,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
  "Not sure yet",
];

export function QuoteForm({
  defaultService,
  source = "quote",
  compact = false,
}: {
  defaultService?: string;
  source?: "quote" | "contact";
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const services = useServices();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(
          typeof payload.error === "string"
            ? payload.error
            : "Something went wrong. Please call us directly or try again."
        );
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please call us directly or try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-leaf-600" />
        <h3 className="mt-4 font-display text-xl font-bold text-slate-900">
          Thank you! Your request has been received.
        </h3>
        <p className="mt-2 text-slate-600">
          Our team will get back to you shortly. For urgent enquiries, please call or
          WhatsApp us.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-outline mt-6"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field — hidden from users, catches bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label className="label" htmlFor="name">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            required
            className="input"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="label" htmlFor="company">
            Company Name
          </label>
          <input id="company" name="company" className="input" placeholder="Optional" />
        </div>
      </div>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label className="label" htmlFor="phone">
            Phone Number *
          </label>
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            className="input"
            placeholder="0779 651 626"
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label className="label" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            className="input"
            placeholder="e.g. Harare"
          />
        </div>
        <div>
          <label className="label" htmlFor="service">
            Service Required
          </label>
          <select
            id="service"
            name="service"
            defaultValue={defaultService || ""}
            className="input"
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="budget">
          Budget Range
        </label>
        <select id="budget" name="budget" className="input" defaultValue="">
          <option value="">Select a budget range</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={compact ? 3 : 4}
          className="input resize-y"
          placeholder="Tell us about your project..."
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Request My Free Quote
          </>
        )}
      </button>
      <p className="text-center text-xs text-slate-400">
        We respect your privacy. See our{" "}
        <Link href="/privacy" className="text-brand-600 underline hover:text-brand-700">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
