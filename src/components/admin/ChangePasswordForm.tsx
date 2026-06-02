"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not change password.");
        return;
      }
      setSuccess("Password updated. Redirecting to sign in…");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (data.reauth) {
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1200);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="current-password">
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input"
          autoComplete="current-password"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="new-password">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
      </div>
      <div>
        <label className="label" htmlFor="confirm-password">
          Confirm new password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-leaf-50 px-4 py-2.5 text-sm text-leaf-800">{success}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4" /> Update password
          </>
        )}
      </button>
    </form>
  );
}
