import { Youtube } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getMedia, getTestimonials } from "@/lib/repository";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { GalleryGrid } from "@/components/GalleryGrid";
import { CTASection } from "@/components/CTASection";

export const metadata = pageMetadata({
  title: "Media Gallery",
  description:
    "Photos and videos of borehole drilling operations, irrigation installations and solar projects by Triumph Global Engineering in Zimbabwe.",
  path: "/gallery",
  keywords: [
    "Borehole Drilling Photos",
    "Irrigation Installation Gallery",
    "Solar Installation Zimbabwe",
  ],
});

export const revalidate = 60;

export default async function GalleryPage() {
  const [media, testimonials] = await Promise.all([getMedia(), getTestimonials()]);
  return (
    <>
      <PageHero
        title="Media Gallery"
        subtitle="Photos and videos from our borehole drilling, irrigation and solar installations across Zimbabwe."
        breadcrumb={[{ label: "Gallery" }]}
      />

      <section className="section">
        <div className="container-page">
          <GalleryGrid items={media} />
        </div>
      </section>

      {/* Success stories */}
      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            center
            eyebrow="Client Success Stories"
            title="Real Results for Real Clients"
            subtitle="Hear from the people and businesses we've helped across Zimbabwe."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="card p-6">
                <p className="text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="font-display text-sm font-bold text-slate-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href={SITE.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <Youtube className="h-4 w-4" /> Watch More on YouTube
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
