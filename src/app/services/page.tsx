import { pageMetadata } from "@/lib/seo";
import { getServices } from "@/lib/repository";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { CTASection } from "@/components/CTASection";

export const metadata = pageMetadata({
  title: "Our Services",
  description:
    "Borehole drilling, borehole survey & siting, deepening, capacity testing, pump installation & retrieval, irrigation design and solar installations across Zimbabwe.",
  path: "/services",
  keywords: [
    "Borehole Drilling Zimbabwe",
    "Irrigation Systems Zimbabwe",
    "Solar Installations Zimbabwe",
    "Engineering Services Zimbabwe",
  ],
});

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        title="Our Engineering Services"
        subtitle="Comprehensive water, irrigation and solar solutions delivered by one trusted partner — from first survey to final commissioning."
        breadcrumb={[{ label: "Services" }]}
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
