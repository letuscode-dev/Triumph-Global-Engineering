"use client";

import { useIsMobile } from "@/lib/use-is-mobile";
import { whatsappLink, whatsappWebLink } from "@/lib/site";

type Props = {
  message?: string;
  number?: string;
  className?: string;
  children: React.ReactNode;
};

/** wa.me on mobile; web.whatsapp.com on desktop to avoid OS app-picker dialogs. */
export function WhatsAppLink({ message, number, className, children }: Props) {
  const mobile = useIsMobile();
  const href = mobile
    ? whatsappLink(message, number)
    : whatsappWebLink(message, number);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={mobile ? "Chat on WhatsApp" : "Open WhatsApp Web"}
    >
      {children}
    </a>
  );
}
