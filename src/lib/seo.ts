import type { Metadata } from "next";
import { SITE } from "./site";

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
}

export function pageMetadata({
  title,
  description,
  path = "",
  image,
  keywords,
}: PageMetaOptions): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = path === "" ? title : `${title} | ${SITE.name}`;

  // When no explicit image is provided, omit `images` so Next.js falls back to
  // the dynamic app/opengraph-image route instead of a missing static file.
  const og: NonNullable<Metadata["openGraph"]> = {
    title: fullTitle,
    description,
    url,
    siteName: SITE.name,
    type: "website",
    locale: "en_ZW",
  };
  if (image) og.images = [{ url: image, width: 1200, height: 630, alt: SITE.name }];

  const twitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    title: fullTitle,
    description,
  };
  if (image) twitter.images = [image];

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: og,
    twitter,
  };
}

// Organization + LocalBusiness structured data for rich results.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phones.map((p) => p.replace(/\s/g, "")),
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    areaServed: "Zimbabwe",
    sameAs: [SITE.socials.facebook, SITE.socials.linkedin, SITE.socials.youtube],
    image: `${SITE.url}/opengraph-image`,
    priceRange: "$$",
  };
}

export function serviceJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url,
    provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url },
    areaServed: { "@type": "Country", name: "Zimbabwe" },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
