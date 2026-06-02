"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { useIsMobile } from "@/lib/use-is-mobile";
import { whatsappLink, whatsappWebLink } from "@/lib/site";
import { PhoneLink } from "@/components/PhoneLink";

export function FloatingActions() {
  const [showCall, setShowCall] = useState(false);
  const site = useSiteSettings();
  const mobile = useIsMobile();
  const whatsappMessage =
    "Hello Triumph Global Engineering, I would like to enquire about your services.";
  const whatsappHref = mobile
    ? whatsappLink(whatsappMessage, site.whatsapp)
    : whatsappWebLink(whatsappMessage, site.whatsapp);

  useEffect(() => {
    const onScroll = () => setShowCall(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-600/30 transition-transform hover:scale-110 motion-safe:animate-float"
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
        <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-[#25D366] opacity-20" />
      </a>

      <PhoneLink
        phone={site.phones[0]}
        phoneIntl={site.phoneIntl[0]}
        aria-label="Call now"
        className={`fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 transition-all duration-300 hover:scale-110 ${
          showCall ? "bottom-24 opacity-100" : "pointer-events-none bottom-20 opacity-0"
        }`}
      >
        <Phone className="h-6 w-6" />
      </PhoneLink>
    </>
  );
}
