import { SafeImage as Image } from "@/components/SafeImage";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { PhoneLink } from "@/components/PhoneLink";
import { WhatsAppLink } from "@/components/WhatsAppLink";

const HIGHLIGHTS = [
  "Free site survey & quote",
  "12+ years experience",
  "Solar-powered options",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      <Image
        src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1920&q=80"
        alt="Engineering field work in Zimbabwe"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-brand-900/80 to-leaf-900/70" />

      <div className="container-page relative py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-leaf-300 ring-1 ring-inset ring-white/20 backdrop-blur">
            Zimbabwe&apos;s Trusted Water & Energy Engineers
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Reliable Borehole, Irrigation & Solar Solutions
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-50">
            {SITE.slogan}. From borehole siting and drilling to smart irrigation and solar
            pumping — we deliver clean water and dependable power across Zimbabwe.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quote" className="btn-secondary text-base">
              Request a Quote
            </Link>
            <WhatsAppLink
              message="Hello Triumph Global Engineering, I'd like to enquire about your services."
              className="btn bg-[#25D366] text-base text-white hover:bg-[#1da851]"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </WhatsAppLink>
            <PhoneLink
              phone={SITE.phones[0]}
              phoneIntl={SITE.phoneIntl[0]}
              className="btn border-2 border-white/60 text-base text-white hover:bg-white/10"
            >
              <Phone className="h-5 w-5" /> Call Now
            </PhoneLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h}
                className="flex items-center gap-2 text-sm font-medium text-white"
              >
                <CheckCircle2 className="h-5 w-5 text-leaf-400" /> {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
