import { SafeImage as Image } from "@/components/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { getProject, getProjects } from "@/lib/repository";
import { SITE } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CATEGORY_LABELS } from "@/lib/content";
import { BeforeAfter } from "@/components/BeforeAfter";
import { CTASection } from "@/components/CTASection";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProjects())
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return pageMetadata({ title: "Project Not Found", description: "" });
  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.cover,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const url = `${SITE.url}/projects/${project.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Projects", url: `${SITE.url}/projects` },
              { name: project.title, url },
            ])
          ),
        }}
      />

      <PageHero
        title={project.title}
        subtitle={project.serviceType}
        breadcrumb={[
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />

      <section className="section">
        <div className="container-page">
          <Link href="/projects" className="btn-outline mb-8 inline-flex py-2 text-sm">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={project.cover}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <span className="absolute left-4 top-4 rounded-full bg-leaf-600 px-3 py-1 text-xs font-semibold text-white">
                {CATEGORY_LABELS[project.category]}
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Project overview</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{project.description}</p>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-brand-500" />
                  <dt className="sr-only">Location</dt>
                  <dd>{project.location}</dd>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-brand-500" />
                  <dt className="sr-only">Completed</dt>
                  <dd>
                    {new Date(project.completedAt).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {project.beforeImage && project.afterImage && (
            <div className="mt-14">
              <h2 className="font-display text-xl font-bold text-slate-900">Before &amp; after</h2>
              <div className="mt-6 max-w-3xl">
                <BeforeAfter before={project.beforeImage} after={project.afterImage} />
              </div>
            </div>
          )}

          {project.images.length > 1 && (
            <div className="mt-14">
              <h2 className="font-display text-xl font-bold text-slate-900">Gallery</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.images.map((src) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
