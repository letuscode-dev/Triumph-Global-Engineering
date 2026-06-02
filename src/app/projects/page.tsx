import Link from "next/link";
import { PlayCircle, Youtube } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/repository";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { BeforeAfter } from "@/components/BeforeAfter";
import { CTASection } from "@/components/CTASection";

export const metadata = pageMetadata({
  title: "Projects Portfolio",
  description:
    "Explore completed borehole drilling, irrigation and solar projects by Triumph Global Engineering across Harare and Zimbabwe.",
  path: "/projects",
  keywords: [
    "Borehole Drilling Projects Zimbabwe",
    "Irrigation Projects",
    "Solar Projects Zimbabwe",
  ],
});

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();
  const beforeAfters = projects.filter((p) => p.beforeImage && p.afterImage);

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="A portfolio of borehole, irrigation and solar projects delivered for clients across Zimbabwe."
        breadcrumb={[{ label: "Projects" }]}
      />

      <section className="section">
        <div className="container-page">
          <ProjectsExplorer projects={projects} />
        </div>
      </section>

      {/* Before & after */}
      {beforeAfters.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-page">
            <SectionHeading
              center
              eyebrow="Transformations"
              title="Before &amp; After"
              subtitle="Drag the slider to see the difference our work makes."
            />
            <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
              {beforeAfters.map((p) => (
                <BeforeAfter
                  key={p.id}
                  before={p.beforeImage!}
                  after={p.afterImage!}
                  label={p.title}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video gallery */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            center
            eyebrow="Video Gallery"
            title="See Us In Action"
            subtitle="Watch borehole drilling, irrigation and solar installations on our YouTube channel."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <a
                key={p.id}
                href={SITE.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover group relative overflow-hidden"
              >
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.cover})` }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 transition group-hover:bg-slate-900/60">
                  <PlayCircle className="h-14 w-14 text-white drop-shadow-lg transition-transform group-hover:scale-110" />
                </div>
                <div className="p-4">
                  <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                    {p.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href={SITE.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <Youtube className="h-4 w-4" /> Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
