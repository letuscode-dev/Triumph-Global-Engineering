import type { Testimonial } from "@/lib/types";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Testimonials"
          title="What Our Clients Say"
          subtitle="Trusted by farmers, homeowners and businesses across Zimbabwe."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <figure key={t.id} className="card flex h-full flex-col p-6">
              <Quote className="h-8 w-8 text-brand-200" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-slate-100 pt-4">
                <div className="font-display text-sm font-bold text-slate-900">
                  {t.name}
                </div>
                <div className="text-xs text-slate-500">
                  {t.role} · {t.location}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
