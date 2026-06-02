"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { PhoneLink } from "@/components/PhoneLink";
import { Logo } from "@/components/Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const site = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="hidden bg-slate-900 text-slate-200 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <span>{site.slogan}</span>
          <div className="flex items-center gap-5">
            {site.phones.map((phone, i) => (
              <PhoneLink
                key={phone}
                phone={phone}
                phoneIntl={site.phoneIntl[i]}
                className="flex items-center gap-1.5 hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" /> {phone}
              </PhoneLink>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur"
            : "border-transparent bg-white"
        }`}
      >
        <nav className="container-page flex h-16 items-center justify-between lg:h-20">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <Link href="/quote" className="btn-primary">
              Request a Quote
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-slate-100 bg-white lg:hidden">
            <div className="container-page space-y-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="btn-primary mt-3 w-full"
              >
                Request a Quote
              </Link>
              <div className="flex flex-col gap-2 pt-3">
                {site.phones.map((phone, i) => (
                  <PhoneLink
                    key={phone}
                    phone={phone}
                    phoneIntl={site.phoneIntl[i]}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <Phone className="h-4 w-4 text-brand-600" /> {phone}
                  </PhoneLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
