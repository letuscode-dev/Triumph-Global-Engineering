// Central company / site configuration defaults. Live values are loaded via
// getSiteSettings() (Supabase or in-memory when edited in admin demo mode).

export type SiteConfig = {
  name: string;
  shortName: string;
  slogan: string;
  description: string;
  url: string;
  email: string;
  phones: string[];
  phoneIntl: string[];
  whatsapp: string;
  address: string;
  hours: readonly { day: string; time: string }[];
  socials: {
    facebook: string;
    linkedin: string;
    youtube: string;
  };
};

export const DEFAULT_SITE: SiteConfig = {
  name: "Triumph Global Engineering",
  shortName: "Triumph Global",
  slogan: "Engineering Zimbabwe's Water, Irrigation & Solar Future",
  description:
    "Triumph Global Engineering is a leading Zimbabwean engineering company specialising in borehole drilling, borehole siting, irrigation systems, water solutions and solar installations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.triumphglobal.co.zw",
  email: process.env.LEADS_NOTIFY_EMAIL || "info@triumphglobal.co.zw",
  phones: ["0779 651 626", "0782 553 213"],
  phoneIntl: ["263779651626", "263782553213"],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "263779651626",
  address: "Harare, Zimbabwe",
  hours: [
    { day: "Monday – Friday", time: "8:00 AM – 5:00 PM" },
    { day: "Saturday", time: "8:00 AM – 1:00 PM" },
    { day: "Sunday & Public Holidays", time: "Emergency call-outs only" },
  ],
  socials: {
    facebook: "https://facebook.com/triumphglobalengineering",
    linkedin: "https://linkedin.com/company/triumphglobalengineering",
    youtube: "https://youtube.com/@triumphglobalengineering",
  },
};

/** Static defaults for metadata and fallbacks. Prefer getSiteSettings() in server code. */
export const SITE = DEFAULT_SITE;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export function whatsappLink(message?: string, number: string = DEFAULT_SITE.whatsapp) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Opens WhatsApp in the browser — better on desktop (no "Pick an app" prompt). */
export function whatsappWebLink(message?: string, number: string = DEFAULT_SITE.whatsapp) {
  const params = new URLSearchParams({ phone: number.replace(/\D/g, "") });
  if (message) params.set("text", message);
  return `https://web.whatsapp.com/send?${params}`;
}
