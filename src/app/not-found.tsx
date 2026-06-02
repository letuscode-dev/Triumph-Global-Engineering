import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="heading-gradient font-display text-7xl font-extrabold">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
