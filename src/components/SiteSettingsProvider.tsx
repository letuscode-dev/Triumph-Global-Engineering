"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "@/lib/site";
import { DEFAULT_SITE, whatsappLink, whatsappWebLink } from "@/lib/site";

const SiteSettingsContext = createContext<SiteConfig>(DEFAULT_SITE);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function useWhatsappLink(message?: string) {
  const { whatsapp } = useSiteSettings();
  if (typeof window !== "undefined") {
    const mobile =
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    return mobile ? whatsappLink(message, whatsapp) : whatsappWebLink(message, whatsapp);
  }
  return whatsappLink(message, whatsapp);
}
