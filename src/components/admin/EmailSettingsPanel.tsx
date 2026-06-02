"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";

export function EmailSettingsPanel({
  configured,
  notifyEmail,
  fromAddress,
}: {
  configured: boolean;
  notifyEmail: string;
  fromAddress: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function sendTest() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Test email failed.");
        return;
      }
      setIsError(false);
      setMessage(`Test email sent to ${notifyEmail}. Check your inbox (and spam folder).`);
    } catch {
      setIsError(true);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Notify address</dt>
          <dd className="font-medium text-slate-900">{notifyEmail}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">From address</dt>
          <dd className="max-w-[14rem] truncate font-mono text-xs text-slate-700">
            {fromAddress}
          </dd>
        </div>
      </dl>

      {!configured && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Resend is not configured yet</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-amber-800">
            <li>
              Create a free account at{" "}
              <a
                href="https://resend.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                resend.com
              </a>
              .
            </li>
            <li>
              Create an API key and add{" "}
              <code className="rounded bg-white/60 px-1 font-mono text-xs">RESEND_API_KEY</code> to{" "}
              <code className="rounded bg-white/60 px-1 font-mono text-xs">.env.local</code>.
            </li>
            <li>
              Set{" "}
              <code className="rounded bg-white/60 px-1 font-mono text-xs">RESEND_FROM</code> to a
              verified sender (or use Resend&apos;s test sender while developing).
            </li>
            <li>Restart the dev server, then click &quot;Send test email&quot; below.</li>
          </ol>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 rounded-lg px-4 py-2.5 text-sm ${
            isError ? "bg-red-50 text-red-700" : "bg-leaf-50 text-leaf-800"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={sendTest}
        disabled={loading || !configured}
        className="btn-outline mt-4 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send test email
          </>
        )}
      </button>

      {!configured && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Mail className="h-3.5 w-3.5" />
          Leads are still saved in the admin dashboard and Supabase without email.
        </p>
      )}
    </div>
  );
}
