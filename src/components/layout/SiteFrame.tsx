"use client";

import { usePathname } from "next/navigation";
import type { Service } from "@/lib/types";
import type { SiteConfig } from "@/lib/site";
import { ServicesProvider } from "@/components/ServicesProvider";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";

export function SiteFrame({
  children,
  services,
  site,
}: {
  children: React.ReactNode;
  services: Service[];
  site: SiteConfig;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <SiteSettingsProvider settings={site}>
      <ServicesProvider services={services}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </ServicesProvider>
    </SiteSettingsProvider>
  );
}
