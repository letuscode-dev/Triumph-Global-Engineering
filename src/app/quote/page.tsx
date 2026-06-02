import { CheckCircle2, Clock, MessageCircle, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SITE, whatsappLink } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description:
    "Request a free, no-obligation quote for borehole drilling, irrigation systems, solar installations and water solutions in Zimbabwe.",
  path: "/quote",
  keywords: [
    "Borehole Drilling Quote Zimbabwe",
    "Free Quote Irrigation",
    "Solar Quote Zimbabwe",
  ],
});

const PERKS = [
  "Free, no-obligation quotation",
  "Fast response from our engineers",
  "Transparent, itemised pricing",
  "Expert advice tailored to your site",
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        title="Request a Free Quote"
        subtitle="Tell us about your project and our team will get back to you with a tailored quotation — usually within one business day."
        breadcrumb={[{ label: "Request a Quote" }]}
      />

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-extrabold text-slate-900">
                Project Details
              </h2>
              <p className="mt-1 text-slate-600">Fields marked with * are required.</p>
              <div className="mt-6">
                <QuoteForm source="quote" />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-leaf-700 p-6 text-white">
                <h3 className="font-display text-lg font-bold">Why Request a Quote?</h3>
                <ul className="mt-4 space-y-3">
                  {PERKS.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-sm text-brand-50"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf-300" />{" "}
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="font-display font-bold text-slate-900">Prefer to talk?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Reach us directly — we&apos;re happy to help.
                </p>
                <div className="mt-4 space-y-3">
                  {SITE.phones.map((phone, i) => (
                    <a
                      key={phone}
                      href={`tel:+${SITE.phoneIntl[i]}`}
                      className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50"
                    >
                      <Phone className="h-4 w-4 text-brand-600" /> {phone}
                    </a>
                  ))}
                  <a
                    href={whatsappLink("Hello, I'd like a quote for your services.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#1da851] hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-4 w-4" /> Mon–Fri 8am–5pm · Sat 8am–1pm
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
