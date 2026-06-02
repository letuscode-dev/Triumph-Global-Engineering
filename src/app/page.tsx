import { SafeImage as Image } from "@/components/SafeImage";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { getServices, getProjects, getMedia, getTestimonials } from "@/lib/repository";
import { SITE } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { ServiceCard } from "@/components/ServiceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";

export const revalidate = 60;

const WHY = [
  {
    icon: ShieldCheck,
    title: "Qualified & Experienced",
    detail: "Skilled hydro-geologists and engineers with 12+ years in the field.",
  },
  {
    icon: Wrench,
    title: "End-to-End Service",
    detail: "From survey and drilling to pumps, irrigation and solar — all in one place.",
  },
  {
    icon: Sparkles,
    title: "Quality Guaranteed",
    detail: "Trusted components, modern equipment and workmanship you can rely on.",
  },
];

export default async function HomePage() {
  const [services, projects, media, testimonials] = await Promise.all([
    getServices(),
    getProjects(),
    getMedia(),
    getTestimonials(),
  ]);
  const featured = (
    projects.filter((p) => p.featured).length
      ? projects.filter((p) => p.featured)
      : projects
  ).slice(0, 3);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services offered by Triumph Global Engineering",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${SITE.url}/services/${s.slug}`,
    })),
  };

  const rated = testimonials.filter((t) => typeof t.rating === "number" && t.rating > 0);
  const aggregateRatingJsonLd =
    rated.length >= 3
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              rated.reduce((sum, t) => sum + t.rating, 0) / rated.length
            ).toFixed(1),
            reviewCount: rated.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {aggregateRatingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
        />
      )}
      <Hero />

      {/* Intro / Why choose us */}
      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Who We Are</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineering Zimbabwe&apos;s Access to Water &amp; Clean Energy
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Triumph Global Engineering is a trusted Zimbabwean engineering company
              specialising in borehole drilling, water solutions, irrigation systems and
              solar installations. We combine modern equipment with deep local expertise
              to deliver reliable results for homes, farms, businesses and communities.
            </p>
            <div className="mt-8 space-y-5">
              {WHY.map((w) => (
                <div key={w.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <w.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">{w.title}</h3>
                    <p className="text-sm text-slate-600">{w.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-primary mt-8">
              More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=600&q=80"
                alt="Borehole drilling rig"
                width={600}
                height={760}
                className="mt-8 h-full w-full rounded-2xl object-cover shadow-lg"
              />
              <Image
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80"
                alt="Irrigation system"
                width={600}
                height={760}
                className="h-full w-full rounded-2xl object-cover shadow-lg"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-6 py-4 text-center shadow-xl ring-1 ring-slate-100">
              <div className="font-display text-2xl font-extrabold text-brand-600">
                850+
              </div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Projects Delivered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="section bg-slate-50">
        <div className="container-page">
          <SectionHeading
            center
            eyebrow="Our Services"
            title="Complete Water, Irrigation & Solar Solutions"
            subtitle="Everything you need to secure water and power — delivered by one trusted engineering partner."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* Featured projects */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured Work"
              title="Recent Projects"
              subtitle="A selection of recent borehole, irrigation and solar projects across Zimbabwe."
            />
            <Link href="/projects" className="btn-outline">
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      <Testimonials items={testimonials} />

      {/* Gallery preview */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Gallery"
              title="From The Field"
              subtitle="Photos from our borehole, irrigation and solar installations."
            />
            <Link href="/gallery" className="btn-outline">
              View Gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {media.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={m.src}
                  alt={m.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {m.caption}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
