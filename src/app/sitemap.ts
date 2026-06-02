import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getLatestContentModified, getServices, getPosts, getProjects } from "@/lib/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, projects, contentModified] = await Promise.all([
    getServices(),
    getPosts(),
    getProjects(),
    getLatestContentModified(),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/gallery",
    "/blog",
    "/quote",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: contentModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: contentModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const projectRoutes = projects
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE.url}/projects/${p.slug}`,
      lastModified: p.completedAt ? new Date(p.completedAt) : contentModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...projectRoutes];
}
