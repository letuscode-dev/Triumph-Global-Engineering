import { SafeImage as Image } from "@/components/SafeImage";
import { Award, CheckCircle2, Eye, Target } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { VALUES, TEAM, STATS } from "@/lib/content";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Icon } from "@/components/Icon";
import { CTASection } from "@/components/CTASection";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about Triumph Global Engineering — a leading Zimbabwean engineering company delivering borehole drilling, irrigation and solar solutions with 12+ years of experience.",
  path: "/about",
  keywords: ["About Triumph Global Engineering", "Engineering Company Zimbabwe"],
});

const WHY_CHOOSE = [
  "Qualified hydro-geologists and engineers",
  "Modern, well-maintained drilling rigs",
  "Transparent, itemised quotations",
  "Solar-powered pumping expertise",
  "Workmanship guarantee on every project",
  "Nationwide coverage from our Harare base",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Triumph Global Engineering"
        subtitle="A trusted Zimbabwean partner for borehole drilling, water solutions, irrigation and solar energy."
        breadcrumb={[{ label: "About" }]}
      />

      {/* History */}
      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Our Story</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Building Reliable Water &amp; Energy Infrastructure
            </h2>
            <div className="mt-5 space-y-4 text-slate-600">
              <p>
                Triumph Global Engineering was founded to solve one of Zimbabwe&apos;s
                most pressing challenges — reliable access to clean water and dependable
                energy. What began as a borehole drilling outfit has grown into a
                full-service engineering company spanning water, irrigation and solar
                solutions.
              </p>
              <p>
                Over more than a decade, we have completed hundreds of projects for
                homeowners, commercial farmers, businesses and communities. Our reputation
                is built on honest advice, quality workmanship and engineering done right
                the first time.
              </p>
              <p>
                Today, we combine modern equipment with deep local knowledge to help our
                clients secure water and power for generations to come.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80"
              alt="Triumph Global Engineering team at work"
              width={900}
              height={650}
              className="w-full rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section bg-slate-50">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Target className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-slate-900">
              Our Mission
            </h3>
            <p className="mt-3 text-slate-600">
              To deliver reliable, affordable and sustainable water, irrigation and solar
              engineering solutions that improve lives and livelihoods across Zimbabwe.
            </p>
          </div>
          <div className="card p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
              <Eye className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-slate-900">
              Our Vision
            </h3>
            <p className="mt-3 text-slate-600">
              To be Zimbabwe&apos;s most trusted engineering company for water and clean
              energy — recognised for quality, integrity and lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            center
            eyebrow="Our Values"
            title="What We Stand For"
            subtitle="The principles that guide every project we undertake."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card card-hover p-6 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-leaf-50 text-brand-600">
                  <Icon name={v.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-display font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-slate-50">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Why Clients Trust Triumph Global Engineering
            </h2>
            <p className="mt-4 text-slate-600">
              We are committed to doing engineering right — combining technical excellence
              with honest service and fair pricing.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {WHY_CHOOSE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="card p-6 text-center">
                <div className="font-display text-3xl font-extrabold text-brand-600">
                  {s.value.toLocaleString()}
                  {s.suffix}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            center
            eyebrow="Our Team"
            title="The Experts Behind Every Project"
            subtitle="A multidisciplinary team of engineers and specialists dedicated to your success."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.role} className="card card-hover p-6 text-center">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-leaf-600 font-display text-2xl font-bold text-white">
                  {m.initials}
                </span>
                <h3 className="mt-4 font-display font-bold text-slate-900">{m.name}</h3>
                <p className="text-sm text-brand-600">{m.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-brand-100 bg-brand-50/50 p-8 text-center">
            <Award className="mx-auto h-10 w-10 text-brand-600" />
            <h3 className="mt-3 font-display text-xl font-bold text-slate-900">
              Certifications &amp; Experience
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-slate-600">
              Our team holds qualifications in hydro-geology, agricultural and
              renewable-energy engineering, with over 12 years of combined field
              experience delivering compliant, high-quality projects across Zimbabwe.
              Contact us at {SITE.email} for credentials.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
