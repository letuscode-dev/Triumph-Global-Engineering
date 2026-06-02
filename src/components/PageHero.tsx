import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-leaf-700">
      <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="container-page relative py-14 sm:py-20">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-brand-100">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            {breadcrumb.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                {b.href ? (
                  <Link href={b.href} className="hover:text-white">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-50 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
