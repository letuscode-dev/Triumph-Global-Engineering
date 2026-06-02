"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-slate-600">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
