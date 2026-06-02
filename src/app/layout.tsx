import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";
import { getServices } from "@/lib/repository";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteFrame } from "@/components/layout/SiteFrame";
import { Analytics } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Borehole Drilling, Irrigation & Solar in Zimbabwe`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Borehole Drilling Zimbabwe",
    "Borehole Drilling Harare",
    "Borehole Survey Zimbabwe",
    "Borehole Deepening Zimbabwe",
    "Borehole Pump Installation Zimbabwe",
    "Irrigation Systems Zimbabwe",
    "Irrigation Design Zimbabwe",
    "Solar Installations Zimbabwe",
    "Water Solutions Zimbabwe",
    "Engineering Services Zimbabwe",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  robots: { index: true, follow: true },
  alternates: {
    types: {
      "application/rss+xml": `${SITE.url}/feed.xml`,
    },
  },
  icons: { icon: "/favicon.svg" },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [services, site] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <SiteFrame services={services} site={site}>
          {children}
        </SiteFrame>
        <Analytics gaId={GA_ID} />
      </body>
    </html>
  );
}
