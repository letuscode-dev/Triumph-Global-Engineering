"use client";

import Link from "next/link";
import { Facebook, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { useServices } from "@/components/ServicesProvider";
import { PhoneLink } from "@/components/PhoneLink";
import { Logo } from "@/components/Logo";

export function Footer() {
  const services = useServices();
  const site = useSiteSettings();
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo light />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{site.description}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.socials.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-800 p-2 hover:bg-brand-600"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={site.socials.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-800 p-2 hover:bg-brand-600"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={site.socials.youtube}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-800 p-2 hover:bg-brand-600"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-leaf-400">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quote" className="text-slate-400 hover:text-leaf-400">
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-slate-400 hover:text-leaf-400"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-sm">
              {site.phones.map((phone, i) => (
                <li key={phone}>
                  <PhoneLink
                    phone={phone}
                    phoneIntl={site.phoneIntl[i]}
                    className="flex items-center gap-2.5 text-slate-400 hover:text-leaf-400"
                  >
                    <Phone className="h-4 w-4 text-brand-400" /> {phone}
                  </PhoneLink>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 text-slate-400 hover:text-leaf-400"
                >
                  <Mail className="h-4 w-4 text-brand-400" /> {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="h-4 w-4 text-brand-400" /> {site.address}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>Borehole Drilling · Irrigation · Solar · Water Solutions — Zimbabwe</span>
            <Link href="/privacy" className="text-slate-400 hover:text-leaf-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
