import { SafeImage as Image } from "@/components/SafeImage";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/repository";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";

export const metadata = pageMetadata({
  title: "Blog & News",
  description:
    "Borehole drilling tips, water management advice, irrigation solutions, solar energy insights and company news from Triumph Global Engineering.",
  path: "/blog",
  keywords: [
    "Borehole Drilling Tips",
    "Water Management Zimbabwe",
    "Irrigation Solutions",
    "Solar Energy Zimbabwe",
  ],
});

const CATEGORIES = [
  "Borehole Drilling Tips",
  "Water Management",
  "Irrigation Solutions",
  "Solar Energy",
  "Company News",
  "Project Updates",
];

export const revalidate = 60;

export default async function BlogPage() {
  const posts = [...(await getPosts())].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        title="Blog &amp; News"
        subtitle="Expert tips and updates on borehole drilling, water management, irrigation and solar energy in Zimbabwe."
        breadcrumb={[{ label: "Blog" }]}
      />

      <section className="section">
        <div className="container-page">
          {/* Categories */}
          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="card card-hover group mb-12 grid overflow-hidden lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8">
                <span className="eyebrow w-fit">{featured.category}</span>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
                  {featured.title}
                </h2>
                <p className="mt-3 text-slate-600">{featured.excerpt}</p>
                <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featured.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {featured.readMinutes} min read
                  </span>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )}

          {/* Rest */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="line-clamp-2 font-display text-lg font-bold text-slate-900">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
