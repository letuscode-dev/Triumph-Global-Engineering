import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Icon } from "./Icon";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="card card-hover group flex flex-col p-6"
    >
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-leaf-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:from-brand-600 group-hover:to-leaf-600 group-hover:text-white">
        <Icon name={service.icon} className="h-7 w-7" />
      </span>
      <h3 className="font-display text-lg font-bold text-slate-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {service.excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2.5">
        Learn more <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
