import { Clock, Mail, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SITE, whatsappLink } from "@/lib/site";
import { getFaqs } from "@/lib/repository";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact Triumph Global Engineering for borehole drilling, irrigation and solar solutions in Zimbabwe. Call, WhatsApp, email or send us a message.",
  path: "/contact",
  keywords: ["Contact Borehole Drilling Zimbabwe", "Engineering Company Harare Contact"],
});

const mapEmbed =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED ||
  "https://www.google.com/maps?q=Harare,Zimbabwe&output=embed";

export const revalidate = 60;

export default async function ContactPage() {
  const FAQS = await getFaqs();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        title="Get In Touch"
        subtitle="Have a question or ready to start a project? We'd love to hear from you."
        breadcrumb={[{ label: "Contact" }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <div>
            <span className="eyebrow">Contact Information</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900">
              We&apos;re Here to Help
            </h2>
            <p className="mt-3 text-slate-600">
              Reach out by phone, WhatsApp or email — or send us a message using the form
              and we&apos;ll respond promptly.
            </p>

            <div className="mt-8 space-y-4">
              {SITE.phones.map((phone, i) => (
                <a
                  key={phone}
                  href={`tel:+${SITE.phoneIntl[i]}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Call us
                    </div>
                    <div className="font-display font-bold text-slate-900">{phone}</div>
                  </div>
                </a>
              ))}

              <a
                href={whatsappLink("Hello Triumph Global Engineering!")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-leaf-200 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#1da851]">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    WhatsApp
                  </div>
                  <div className="font-display font-bold text-slate-900">
                    Chat with us
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </div>
                  <div className="font-display font-bold text-slate-900">
                    {SITE.email}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Location
                  </div>
                  <div className="font-display font-bold text-slate-900">
                    {SITE.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Business hours */}
            <div className="mt-8 rounded-2xl bg-slate-50 p-6">
              <h3 className="flex items-center gap-2 font-display font-bold text-slate-900">
                <Clock className="h-5 w-5 text-brand-600" /> Business Hours
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {SITE.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4 text-slate-600">
                    <span>{h.day}</span>
                    <span className="font-medium text-slate-900">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-extrabold text-slate-900">
                Send Us a Message
              </h2>
              <p className="mt-1 text-slate-600">
                We&apos;ll get back to you as soon as possible.
              </p>
              <div className="mt-6">
                <QuoteForm source="contact" compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16">
        <div className="container-page">
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <iframe
              title="Triumph Global Engineering location"
              src={mapEmbed}
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-slate-50">
        <div className="container-page max-w-3xl">
          <SectionHeading
            center
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Answers to the questions we hear most often."
          />
          <div className="mt-10 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-slate-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display font-semibold text-slate-900">
                  {faq.question}
                  <Plus className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
