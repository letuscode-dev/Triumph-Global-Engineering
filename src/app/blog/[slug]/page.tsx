import { SafeImage as Image } from "@/components/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getPost, getPosts } from "@/lib/repository";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return pageMetadata({ title: "Article Not Found", description: "" });
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover,
    keywords: [post.category],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PageHero
        title={post.title}
        breadcrumb={[{ label: "Blog", href: "/blog" }, { label: post.category }]}
      />

      <article className="section">
        <div className="container-page max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readMinutes} min read
            </span>
          </div>

          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <div className="prose mt-8 max-w-none">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="mb-5 text-lg leading-relaxed text-slate-700">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <Link href="/blog" className="btn-outline">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="section bg-slate-50">
        <div className="container-page">
          <h2 className="font-display text-2xl font-extrabold text-slate-900">
            Related Articles
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-brand-600">
                    {p.category}
                  </span>
                  <h3 className="mt-1.5 line-clamp-2 font-display font-bold text-slate-900">
                    {p.title}
                  </h3>
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
