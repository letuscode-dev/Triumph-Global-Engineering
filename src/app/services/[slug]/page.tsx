import { SafeImage as Image } from "@/components/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { getService, getServices } from "@/lib/repository";
import { SITE, whatsappLink } from "@/lib/site";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";
import { QuoteForm } from "@/components/QuoteForm";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return pageMetadata({ title: "Service Not Found", description: "" });
  return pageMetadata({
    title: service.title,
    description: service.excerpt,
    path: `/services/${service.slug}`,
    image: service.image,
    keywords: service.keywords,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const others = (await getServices()).filter((s) => s.slug !== service.slug).slice(0, 3);
  const url = `${SITE.url}/services/${service.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd(service.title, service.excerpt, url)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: service.title, url },
            ])
          ),
        }}
      />

      <PageHero
        title={service.title}
        subtitle={service.excerpt}
        breadcrumb={[
          { label: "Services", href: "/services" },
          { label: service.shortTitle },
        ]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>

            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-leaf-600 text-white">
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-slate-900">
              Professional {service.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {service.description}
            </p>

            {/* Benefits */}
            <h3 className="mt-10 font-display text-xl font-bold text-slate-900">
              Key Benefits
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf-600" /> {b}
                </li>
              ))}
            </ul>

            {/* Process */}
            <h3 className="mt-10 font-display text-xl font-bold text-slate-900">
              Our Process
            </h3>
            <ol className="mt-5 space-y-4">
              {service.process.map((p, i) => (
                <li key={p.step} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-slate-900">{p.step}</h4>
                    <p className="text-sm text-slate-600">{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Gallery */}
            <h3 className="mt-10 font-display text-xl font-bold text-slate-900">
              Project Images
            </h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {service.gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={img}
                    alt={`${service.title} ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              ))}
            </div>

            {/* CTA banner */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-700 to-leaf-700 p-6 text-white">
              <div>
                <h3 className="font-display text-lg font-bold">
                  Interested in {service.shortTitle}?
                </h3>
                <p className="text-sm text-brand-50">
                  Talk to our team today for a free assessment and quote.
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={whatsappLink(`Hello, I'm interested in ${service.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-[#25D366] text-white hover:bg-[#1da851]"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href={`tel:+${SITE.phoneIntl[0]}`} className="btn-white">
                  <Phone className="h-4 w-4" /> Call
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar quote form */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="card p-6">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Request a Free Quote
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Fill in the form and we&apos;ll get back to you quickly.
                </p>
                <div className="mt-5">
                  <QuoteForm defaultService={service.title} compact />
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-display font-bold text-slate-900">Other Services</h3>
                <ul className="mt-4 space-y-2">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/services/${o.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {o.shortTitle}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
