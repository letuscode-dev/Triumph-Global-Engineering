import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { PhoneLink } from "@/components/PhoneLink";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export function CTASection({
  title = "Ready to Start Your Project?",
  subtitle = "Get a free, no-obligation quote today. Our engineers are ready to help with your borehole, irrigation or solar needs.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-leaf-600 px-6 py-14 text-center shadow-2xl sm:px-12 sm:py-16">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-base text-brand-50 sm:text-lg">{subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/quote" className="btn-white">
                Request a Quote
              </Link>
              <WhatsAppLink
                message="Hello Triumph Global Engineering, I'd like a quote."
                className="btn bg-[#25D366] text-white hover:bg-[#1da851]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </WhatsAppLink>
              <PhoneLink
                phone={SITE.phones[0]}
                phoneIntl={SITE.phoneIntl[0]}
                className="btn border-2 border-white/70 text-white hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> Call Now
              </PhoneLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
