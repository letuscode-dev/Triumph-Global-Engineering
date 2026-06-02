"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { safeAdminRedirect } from "@/lib/sanitize";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      router.push(safeAdminRedirect(params.get("from")));
      router.refresh();
    } catch {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={submit} className="card p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-center font-display text-xl font-bold text-slate-900">
            Admin Login
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Sign in to manage your website content.
          </p>

          <div className="mt-6">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter admin password"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-5 w-full disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
